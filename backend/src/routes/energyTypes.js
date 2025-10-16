const express = require("express");
const router = express.Router();
const {
  getEnergyTypes,
  getEnergyType,
  createEnergyType,
  updateEnergyType,
  deleteEnergyType,
  toggleEnergyTypeVisibility,
} = require("../controllers/energyTypeController");
const { protect, authorize } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// @route   GET /api/energy-types
// @desc    Get all energy types
// @access  Private
router.get("/", getEnergyTypes);

// @route   GET /api/energy-types/:id
// @desc    Get energy type by ID
// @access  Private
router.get("/:id", getEnergyType);

// Admin only routes
router.use(authorize("admin"));

// @route   POST /api/energy-types
// @desc    Create new energy type
// @access  Private (Admin only)
router.post("/", createEnergyType);

// @route   PUT /api/energy-types/:id
// @desc    Update energy type
// @access  Private (Admin only)
router.put("/:id", updateEnergyType);

// @route   DELETE /api/energy-types/:id
// @desc    Delete energy type
// @access  Private (Admin only)
router.delete("/:id", deleteEnergyType);

// @route   PUT /api/energy-types/:id/toggle-visibility
// @desc    Toggle energy type visibility (hide/show)
// @access  Private (Admin only)
router.put("/:id/toggle-visibility", toggleEnergyTypeVisibility);

module.exports = router;







