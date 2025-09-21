const Location = require("../models/Location");

// @desc    Get all locations with hierarchy
// @route   GET /api/locations
// @access  Private
exports.getLocations = async (req, res) => {
  try {
    // Only authenticated users can access this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const locations = await Location.find({ isActive: true }).sort({ name: 1 });

    // Build hierarchy
    const buildHierarchy = (locations, parentId = null) => {
      const result = [];

      for (const loc of locations) {
        if (
          (loc.parent && loc.parent.toString() !== parentId) ||
          (!loc.parent && parentId !== null)
        )
          continue;

        const node = {
          _id: loc._id,
          name: loc.name,
          code: loc.code,
          type: loc.type,
          isLeaf: loc.isLeaf,
          description: loc.description,
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
      count: locations.length,
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
// @route   GET /api/locations/type/:type
// @access  Private
exports.getLocationsByType = async (req, res) => {
  try {
    // Only authenticated users can access this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { type } = req.params;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Location type is required",
      });
    }

    const locations = await Location.find({ type, isActive: true }).sort({
      name: 1,
    });

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
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { name, code, type, parent, description } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({
      $or: [{ name }, { code }],
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: "Location with this name or code already exists",
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
      code,
      type,
      parent: parent ? parent : null,
      description: description || "",
      isLeaf: type === "machine" || type === "utility",
      isActive: true,
    });

    // Update parent's children array
    if (parentLocation) {
      parentLocation.children.push(location._id);
      await parentLocation.save();
    }

    res.status(201).json({
      success: true,
      message: "Location created successfully",
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
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const { name, code, type, parent, description } = req.body;

    // Check if name or code is already taken by another location
    if (name && name !== location.name) {
      const existingLocation = await Location.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: "Location with this name already exists",
        });
      }
    }

    if (code && code !== location.code) {
      const existingLocation = await Location.findOne({
        code,
        _id: { $ne: req.params.id },
      });
      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: "Location with this code already exists",
        });
      }
    }

    // Update fields if provided
    if (name) location.name = name;
    if (code) location.code = code;
    if (type) location.type = type;
    if (description !== undefined) location.description = description;

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
        const newParent = await Location.findById(parent);
        if (newParent) {
          newParent.children.push(location._id);
          await newParent.save();
          location.parent = parent;
        }
      } else {
        location.parent = null;
      }
    }

    location.updatedAt = Date.now();
    await location.save();

    // Populate the updated location
    const updatedLocation = await Location.findById(location._id).populate(
      "parent",
      "name code type"
    );

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: updatedLocation,
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
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Prevent deletion if location has children
    if (location.children && location.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete location with children. Delete children first.",
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

    await location.remove();

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
