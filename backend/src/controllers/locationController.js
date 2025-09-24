const Location = require("../models/Location");

// @desc    Get all locations with hierarchy
// @route   GET /api/locations
// @access  Private
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });

    // Build hierarchy
    const buildHierarchy = (locations, parentId = null) => {
      const result = [];

      for (const loc of locations) {
        if (loc.parent && loc.parent.toString() !== parentId) continue;

        const node = {
          _id: loc._id,
          name: loc.name,
          type: loc.type,
          isLeaf: loc.isLeaf,
          children: [],
        };

        // Find children
        const children = buildHierarchy(locations, loc._id);
        if (children.length > 0) {
          node.children = children;
        }

        result.push(node);
      }

      return result;
    };

    const hierarchy = buildHierarchy(locations);

    res.status(200).json({
      success: true,
      count: hierarchy.length,
      hierarchy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get locations by type
// @route   GET /api/locations?type=location
// @access  Private
exports.getLocationsByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Location type is required",
      });
    }

    const locations = await Location.find({ type }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get child locations by parent ID
// @route   GET /api/locations/:id/children
// @access  Private
exports.getChildLocations = async (req, res) => {
  try {
    // Only authenticated users can access this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { id } = req.params;

    const locations = await Location.find({
      parent: id,
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (admin only)
exports.createLocation = async (req, res) => {
  try {
    const { name, type, parent } = req.body;

    // Validate user role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create locations",
      });
    }

    // Check if location already exists
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: "Location with this name already exists",
      });
    }

    // If parent is provided, check if it exists
    let parentLocation = null;
    if (parent) {
      parentLocation = await Location.findById(parent);
      if (!parentLocation) {
        return res.status(404).json({
          success: false,
          message: "Parent location not found",
        });
      }
    }

    // Create new location
    const location = await Location.create({
      name,
      type,
      parent: parent ? parent : null,
      isLeaf: type === "machine" || type === "line",
    });

    // Update parent's children array
    if (parentLocation) {
      parentLocation.children.push(location._id);
      await parentLocation.save();
    }

    res.status(201).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, parent } = req.body;

    // Validate user role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update locations",
      });
    }

    // Check if location exists
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Check if name is already taken by another location
    const existingLocation = await Location.findOne({ name, _id: { $ne: id } });
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: "Location with this name already exists",
      });
    }

    // Update location
    location.name = name;
    location.type = type;

    // Handle parent change
    if (parent !== undefined) {
      // Remove from current parent
      if (location.parent) {
        const currentParent = await Location.findById(location.parent);
        if (currentParent) {
          currentParent.children = currentParent.children.filter(
            (childId) => childId.toString() !== location._id.toString()
          );
          await currentParent.save();
        }
      }

      // Set new parent
      if (parent) {
        location.parent = parent;
        const newParent = await Location.findById(parent);
        if (newParent) {
          newParent.children.push(location._id);
          await newParent.save();
        }
      } else {
        location.parent = null;
      }
    }

    // Update isLeaf based on type
    location.isLeaf = type === "machine" || type === "line";

    await location.save();

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete locations",
      });
    }

    // Check if location exists
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Check if location has children
    if (location.children && location.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete location with children",
      });
    }

    // Remove from parent's children array
    if (location.parent) {
      const parent = await Location.findById(location.parent);
      if (parent) {
        parent.children = parent.children.filter(
          (childId) => childId.toString() !== location._id.toString()
        );
        await parent.save();
      }
    }

    // Delete location
    await Location.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getLocations: exports.getLocations,
  getLocationsByType: exports.getLocationsByType,
  getChildLocations: exports.getChildLocations,
  createLocation: exports.createLocation,
  updateLocation: exports.updateLocation,
  deleteLocation: exports.deleteLocation,
};
