const express = require("express");
const { login, refreshAccessToken, logout, logoutAll, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/logout-all", protect, logoutAll);

module.exports = router;
