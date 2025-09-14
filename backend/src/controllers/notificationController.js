const HandoverNotification = require("../models/HandoverNotification");
const LOTO = require("../models/LOTO");

// @desc    Get pending handover notifications for current user
// @route   GET /api/notifications/handover
// @access  Private
exports.getHandoverNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user.id);

    const notifications = await HandoverNotification.find({
      toUser: req.user.id,
      status: "pending",
    })
      .populate("fromUser", "firstName lastName username")
      .populate("lotoId", "isolatedPart reason shift line date")
      .sort({ createdAt: -1 });

    console.log("Found notifications:", notifications.length);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications, // This is the key data
      data: { notifications: notifications }, // Added for consistency
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Accept handover notification
// @route   PUT /api/notifications/handover/:id/accept
// @access  Private
exports.acceptHandover = async (req, res) => {
  try {
    const notification = await HandoverNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.toUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this handover",
      });
    }

    // Update notification status
    notification.status = "accepted";
    notification.respondedAt = Date.now();
    await notification.save();

    // Update LOTO to transfer ownership
    const loto = await LOTO.findById(notification.lotoId);
    if (loto) {
      loto.status = "pending";
      loto.isolator = req.user.id;
      loto.isolatorName = `${req.user.firstName} ${req.user.lastName}`;
      loto.handoverTo = null; // Clear handoverTo field
      await loto.save();
    }

    res.status(200).json({
      success: true,
      message: "Handover accepted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Reject handover notification
// @route   PUT /api/notifications/handover/:id/reject
// @access  Private
exports.rejectHandover = async (req, res) => {
  try {
    const notification = await HandoverNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.toUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this handover",
      });
    }

    // Update notification status
    notification.status = "rejected";
    notification.respondedAt = Date.now();
    await notification.save();

    // Update LOTO status back to active (cancel handover)
    const loto = await LOTO.findById(notification.lotoId);
    if (loto) {
      loto.status = "active";
      loto.handoverTo = null; // Clear handoverTo field
      await loto.save();
    }

    res.status(200).json({
      success: true,
      message: "Handover rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
