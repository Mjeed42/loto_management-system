const EnergyType = require("../models/EnergyType");

// @desc    Get all energy types
// @route   GET /api/energy-types
// @access  Private
exports.getEnergyTypes = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    let filter = {};
    if (!includeInactive) {
      filter.isActive = true;
    }

    const energyTypes = await EnergyType.find(filter)
      .sort({ category: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: energyTypes,
      count: energyTypes.length,
    });
  } catch (error) {
    console.error("Error fetching energy types:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get energy type by ID
// @route   GET /api/energy-types/:id
// @access  Private
exports.getEnergyType = async (req, res) => {
  try {
    const energyType = await EnergyType.findById(req.params.id).lean();

    if (!energyType) {
      return res.status(404).json({
        success: false,
        message: "Energy type not found",
      });
    }

    res.json({
      success: true,
      data: energyType,
    });
  } catch (error) {
    console.error("Error fetching energy type:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new energy type
// @route   POST /api/energy-types
// @access  Private (Admin only)
exports.createEnergyType = async (req, res) => {
  try {
    const { name, symbol, description, category, hazardLevel } = req.body;

    // Validation
    if (!name || !symbol) {
      return res.status(400).json({
        success: false,
        message: "Name and symbol are required",
      });
    }

    // Check for duplicate name
    const existingName = await EnergyType.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "Energy type with this name already exists",
      });
    }

    // Check for duplicate symbol
    const existingSymbol = await EnergyType.findOne({ 
      symbol: { $regex: new RegExp(`^${symbol}$`, 'i') } 
    });
    if (existingSymbol) {
      return res.status(400).json({
        success: false,
        message: "Energy type with this symbol already exists",
      });
    }

    const energyType = await EnergyType.create({
      name,
      symbol,
      description: description || "",
      category: category || "other",
      hazardLevel: hazardLevel || "medium",
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Energy type created successfully",
      data: energyType,
    });
  } catch (error) {
    console.error("Error creating energy type:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update energy type
// @route   PUT /api/energy-types/:id
// @access  Private (Admin only)
exports.updateEnergyType = async (req, res) => {
  try {
    const { name, symbol, description, category, hazardLevel, isActive } = req.body;
    const energyType = await EnergyType.findById(req.params.id);

    if (!energyType) {
      return res.status(404).json({
        success: false,
        message: "Energy type not found",
      });
    }

    // Check for duplicate name (excluding current energy type)
    if (name) {
      const existingName = await EnergyType.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingName) {
        return res.status(400).json({
          success: false,
          message: "Energy type with this name already exists",
        });
      }
      energyType.name = name;
    }

    // Check for duplicate symbol (excluding current energy type)
    if (symbol) {
      const existingSymbol = await EnergyType.findOne({ 
        symbol: { $regex: new RegExp(`^${symbol}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingSymbol) {
        return res.status(400).json({
          success: false,
          message: "Energy type with this symbol already exists",
        });
      }
      energyType.symbol = symbol;
    }

    if (description !== undefined) energyType.description = description;
    if (category !== undefined) energyType.category = category;
    if (hazardLevel !== undefined) energyType.hazardLevel = hazardLevel;
    if (isActive !== undefined) energyType.isActive = isActive;

    await energyType.save();

    res.json({
      success: true,
      message: "Energy type updated successfully",
      data: energyType,
    });
  } catch (error) {
    console.error("Error updating energy type:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete energy type
// @route   DELETE /api/energy-types/:id
// @access  Private (Admin only)
exports.deleteEnergyType = async (req, res) => {
  try {
    const energyType = await EnergyType.findById(req.params.id);

    if (!energyType) {
      return res.status(404).json({
        success: false,
        message: "Energy type not found",
      });
    }

    await EnergyType.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Energy type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting energy type:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Toggle energy type visibility (hide/show)
// @route   PUT /api/energy-types/:id/toggle-visibility
// @access  Private (Admin only)
exports.toggleEnergyTypeVisibility = async (req, res) => {
  try {
    const energyType = await EnergyType.findById(req.params.id);

    if (!energyType) {
      return res.status(404).json({
        success: false,
        message: "Energy type not found",
      });
    }

    energyType.isActive = !energyType.isActive;
    await energyType.save();

    const action = energyType.isActive ? "shown" : "hidden";
    
    res.json({
      success: true,
      message: `Energy type ${action} successfully`,
      data: energyType,
    });
  } catch (error) {
    console.error("Error toggling energy type visibility:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};















