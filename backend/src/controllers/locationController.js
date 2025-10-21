const Location = require("../models/Location");

// @desc    Get all locations (flat list, no hierarchy)
// @route   GET /api/locations
// @access  Private
exports.getLocations = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    // Build query based on includeInactive parameter
    const query = includeInactive === 'true' ? {} : { isActive: true };
    const locations = await Location.find(query).sort({ name: 1 }).lean();

    // Return flat list with only essential fields
    const flatLocations = locations.map(loc => ({
      _id: loc._id,
      name: loc.name,
      code: loc.code,
      type: loc.type,
      typeLabel: loc.typeLabel || loc.type, // Use custom label or default to type
      section: loc.section || null, // Section for grouping root locations
      parent: loc.parent,
      isLeaf: loc.isLeaf,
      isActive: loc.isActive,
      serialNumber: loc.serialNumber || null, // Include serial number for machines
    }));

    res.status(200).json({
      success: true,
      count: flatLocations.length,
      data: flatLocations,
    });
  } catch (error) {
    console.error("Error in getLocations:", error);
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
    }).sort({ name: 1 }).lean();

    // Return simplified format
    const children = locations.map(loc => ({
      _id: loc._id,
      name: loc.name,
      code: loc.code,
      type: loc.type,
      typeLabel: loc.typeLabel || loc.type,
      section: loc.section || null,
      parent: loc.parent,
      isLeaf: loc.isLeaf,
      serialNumber: loc.serialNumber || null, // Include serial number for machines
    }));

    res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error) {
    console.error("Error in getChildLocations:", error);
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
    const { name, code, type, parent, typeLabel, section, serialNumber } = req.body;

    // Validate user role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create locations",
      });
    }

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Generate code from name if not provided
    const locationCode = code || name.toUpperCase().replace(/[^A-Z0-9]/g, '-');

    // Check if location with this name or code already exists
    const existingLocation = await Location.findOne({ 
      $or: [{ name }, { code: locationCode }] 
    });
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: existingLocation.name === name 
          ? "Location with this name already exists"
          : "Location with this code already exists",
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
      code: locationCode,
      type,
      typeLabel: typeLabel || type, // Use custom label or default to type
      section: section || null, // Section for grouping (only for root locations)
      parent: parent ? parent : null,
      isLeaf: type === "machine",
      isActive: true,
      serialNumber: serialNumber || null, // Serial number for machines
    });

    // Update parent's children array
    if (parentLocation) {
      parentLocation.children.push(location._id);
      await parentLocation.save();
    }

    res.status(201).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error creating location:", error);
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
    const { name, code, type, parent, isActive, typeLabel, section, serialNumber } = req.body;

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

    // Check if name or code is already taken by another location
    if (name && name !== location.name) {
      const existingByName = await Location.findOne({ name, _id: { $ne: id } });
      if (existingByName) {
        return res.status(400).json({
          success: false,
          message: "Location with this name already exists",
        });
      }
    }

    if (code && code !== location.code) {
      const existingByCode = await Location.findOne({ code, _id: { $ne: id } });
      if (existingByCode) {
        return res.status(400).json({
          success: false,
          message: "Location with this code already exists",
        });
      }
    }

    // Update location fields
    if (name) location.name = name;
    if (code) location.code = code;
    if (type) location.type = type;
    if (typeLabel !== undefined) location.typeLabel = typeLabel;
    if (section !== undefined) location.section = section;
    if (isActive !== undefined) location.isActive = isActive;
    if (serialNumber !== undefined) location.serialNumber = serialNumber;

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
    if (type) {
      location.isLeaf = type === "machine";
    }

    await location.save();

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Helper function to recursively delete a location and all its children
const deleteLocationRecursive = async (locationId) => {
  const location = await Location.findById(locationId);
  if (!location) return 0;

  let deletedCount = 0;

  // Recursively delete all children first
  if (location.children && location.children.length > 0) {
    for (const childId of location.children) {
      deletedCount += await deleteLocationRecursive(childId);
    }
  }

  // Delete the location itself
  await Location.findByIdAndDelete(locationId);
  deletedCount += 1;

  return deletedCount;
};

// @desc    Delete location
// @route   DELETE /api/locations/:id?cascade=true
// @access  Private (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { cascade } = req.query;

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
    const hasChildren = location.children && location.children.length > 0;
    
    if (hasChildren && cascade !== 'true') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete location with children. Use cascade=true to delete all children.",
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

    let deletedCount = 1;
    let message = "Location deleted successfully";

    if (cascade === 'true' && hasChildren) {
      // Use recursive delete to remove all children
      deletedCount = await deleteLocationRecursive(id);
      message = `Location and ${deletedCount - 1} child item(s) deleted successfully`;
    } else {
      // Simple delete (no children)
      await Location.findByIdAndDelete(id);
    }

    res.status(200).json({
      success: true,
      message: message,
      deletedCount: deletedCount,
    });
  } catch (error) {
    console.error("Error deleting location:", error);
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
