const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY_SESSION = 24 * 60 * 60 * 1000; // 24 hours for session (browser close)
const REFRESH_TOKEN_EXPIRY_REMEMBER = 7 * 24 * 60 * 60 * 1000; // 7 days for remember me

// Generate Access Token (short-lived, stored in memory)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate Refresh Token (long-lived, stored in httpOnly cookie)
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log("Login attempt received:", req.body);
    const { username, password, rememberMe = false } = req.body;

    // Validate email and password
    if (!username || !password) {
      console.log("Missing username or password");
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Check for user
    const user = await User.findOne({
      $or: [{ email: username }, { username }],
    }).select("+password");

    console.log("User lookup result:", user);

    if (!user) {
      console.log("User not found for username:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log("User account is deactivated:", username);
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken();

    // Calculate refresh token expiry based on rememberMe
    const refreshTokenExpiry = rememberMe
      ? REFRESH_TOKEN_EXPIRY_REMEMBER
      : REFRESH_TOKEN_EXPIRY_SESSION;

    const expiresAt = new Date(Date.now() + refreshTokenExpiry);

    // Store refresh token in database
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip || req.connection.remoteAddress,
      isRememberMe: rememberMe,
    });

    console.log("Tokens generated successfully for user:", user.username);
    console.log("Setting cookie with options:", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: rememberMe ? refreshTokenExpiry : undefined,
      path: "/",
      rememberMe: rememberMe
    });

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site for production
      maxAge: rememberMe ? refreshTokenExpiry : undefined, // Session cookie if not remember me
      path: "/",
    });
    
    console.log("Cookie set successfully");

    // Send access token in response (to be stored in memory)
    res.status(200).json({
      success: true,
      accessToken,
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token in cookie)
const refreshAccessToken = async (req, res) => {
  try {
    console.log("Refresh token request received");
    console.log("Request origin:", req.headers.origin);
    console.log("Cookies received:", Object.keys(req.cookies));
    
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      console.log("No refresh token found in cookies");
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if token is expired
    if (storedToken.isExpired()) {
      await storedToken.deleteOne();
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    // Check idle timeout
    if (storedToken.isIdleTimeout()) {
      await storedToken.deleteOne();
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "Session expired due to inactivity",
      });
    }

    // Check absolute timeout
    if (storedToken.isAbsoluteTimeout()) {
      await storedToken.deleteOne();
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again",
      });
    }

    // Update last activity
    await storedToken.updateActivity();

    // Generate new access token
    const accessToken = generateAccessToken(storedToken.userId);

    // Optionally rotate refresh token for added security
    const newRefreshToken = generateRefreshToken();
    const refreshTokenExpiry = storedToken.isRememberMe
      ? REFRESH_TOKEN_EXPIRY_REMEMBER
      : REFRESH_TOKEN_EXPIRY_SESSION;

    // Update refresh token in database
    storedToken.token = newRefreshToken;
    storedToken.expiresAt = new Date(Date.now() + refreshTokenExpiry);
    await storedToken.save();

    // Update cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: storedToken.isRememberMe ? refreshTokenExpiry : undefined,
      path: "/",
    });

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Delete refresh token from database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res) => {
  try {
    // Delete all refresh tokens for this user
    await RefreshToken.revokeAllForUser(req.user.id);

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
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
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  getMe,
};
