const express = require("express");
const {
  getHandoverNotifications,
  acceptHandover,
  rejectHandover,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  getNotificationCount,
  getAllHandoverNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/handover").get(protect, getHandoverNotifications);
router.route("/handover/count").get(protect, getNotificationCount);
router.route("/handover/all").get(protect, getAllHandoverNotifications); // Admin only - get ALL notifications

router.route("/handover/:id/accept").put(protect, acceptHandover);
router.route("/handover/:id/reject").put(protect, rejectHandover);
router.route("/handover/:id/read").put(protect, markNotificationAsRead);

router.route("/handover/read-all").put(protect, markAllNotificationsAsRead);
router.route("/handover/delete-all").delete(protect, deleteAllNotifications);

module.exports = router;
