const express = require("express");
const {
  getHandoverNotifications,
  acceptHandover,
  rejectHandover,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/handover").get(protect, getHandoverNotifications);

router.route("/handover/:id/accept").put(protect, acceptHandover);

router.route("/handover/:id/reject").put(protect, rejectHandover);

module.exports = router;
