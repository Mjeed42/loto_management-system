const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    console.log(
      "Admin getUsers request from user:",
      req.user.id,
      req.user.role
    );

    // Only admin can access this
    if (req.user.role !== "admin") {
      console.log("Unauthorized access attempt - not admin");
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const users = await User.find().select("-password");
    console.log("Found users:", users.length);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
  try {
    console.log(
      "Admin createUser request from user:",
      req.user.id,
      req.user.role
    );

    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { username, email, password, firstName, lastName, employeeId, role } =
      req.body;
    console.log("Creating user with data:", {
      username,
      email,
      firstName,
      lastName,
      role,
    });

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      console.log("User already exists:", username, email);
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully");

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      employeeId,
      role: role || "technician",
    });

    console.log("User created successfully:", user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    console.log("Admin updateUser request for user:", req.params.id);

    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from modifying themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify your own account through this endpoint",
      });
    }

    const { firstName, lastName, employeeId, role, isActive } = req.body;

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (employeeId) user.employeeId = employeeId;
    if (role) user.role = role;
    if (typeof isActive !== "undefined") user.isActive = isActive;

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    console.log("Admin deleteUser request for user:", req.params.id);
    console.log("Request user:", req.user.id, req.user.role);

    // Only admin can access this
    if (req.user.role !== "admin") {
      console.log("UNAUTHORIZED: User is not admin - role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("User not found for deletion:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      console.log("Cannot delete own account:", req.user.id);
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Use deleteOne instead of remove (deprecated in newer Mongoose versions)
    await User.deleteOne({ _id: req.params.id });
    console.log("User deleted successfully:", req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private (Admin only)
exports.resetPassword = async (req, res) => {
  try {
    console.log("Admin resetPassword request for user:", req.params.id);

    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("User not found for password reset:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { newPassword } = req.body;
    console.log(
      "New password length:",
      newPassword ? newPassword.length : "undefined"
    );

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedAt = Date.now();
    await user.save();

    console.log("Password reset successfully for user:", req.params.id);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    console.log("Admin toggleUserStatus request for user:", req.params.id);

    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("User not found for status toggle:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from disabling themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot disable your own account",
      });
    }

    user.isActive = !user.isActive;
    user.updatedAt = Date.now();
    await user.save();

    console.log(
      "User status toggled successfully:",
      req.params.id,
      "new status:",
      user.isActive
    );

    res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
