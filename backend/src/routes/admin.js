const express = require("express");
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All routes require admin authorization
router.use(protect, authorize("admin"));

router
  .route("/users")
  .get(adminController.getUsers)
  .post(adminController.createUser);

router
  .route("/users/:id")
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

router.route("/users/:id/reset-password").put(adminController.resetPassword);

router.route("/users/:id/toggle-status").put(adminController.toggleUserStatus);

module.exports = router;
