const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
      code: "NO_TOKEN",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );

    // Add user to request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Check if user is still active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
        code: "USER_INACTIVE",
      });
    }

    // Update activity timestamp for the refresh token if exists
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const storedToken = await RefreshToken.findOne({ token: refreshToken });
      if (storedToken && !storedToken.isExpired()) {
        await storedToken.updateActivity();
      }
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
      code: "INVALID_TOKEN",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to access this route",
      });
    }
    next();
  };
};
