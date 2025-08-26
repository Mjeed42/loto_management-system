const User = require("../models/User");

// @desc    Get all technicians for handover
// @route   GET /api/users/technicians
// @access  Private
exports.getTechnicians = async (req, res) => {
  try {
    console.log("Fetching technicians for user:", req.user.id);

    // Get all users with technician role (excluding the current user)
    const technicians = await User.find({
      role: "technician",
      _id: { $ne: req.user.id }, // Exclude current user
    }).select("firstName lastName username");

    console.log("Found technicians:", technicians.length);

    res.status(200).json({
      success: true,
      count: technicians.length,
      technicians: technicians, // Make sure this is the direct array
      data: {
        technicians: technicians, // Also provide in data object for consistency
      },
    });
  } catch (error) {
    console.error("Get technicians error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
