const express = require("express");
const {
  getLocations,
  getLocationsByType,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Public routes for authenticated users
router.route("/").get(getLocations);

router.route("/type/:type").get(getLocationsByType);

// Admin only routes
router.use(authorize("admin"));

router.route("/").post(createLocation);

router.route("/:id").put(updateLocation).delete(deleteLocation);

module.exports = router;
