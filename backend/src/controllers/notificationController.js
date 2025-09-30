const HandoverNotification = require("../models/HandoverNotification");
const LOTO = require("../models/LOTO");

// @desc    Get pending handover notifications for current user
// @route   GET /api/notifications/handover
// @access  Private
exports.getHandoverNotifications = async (req, res) => {
  try {
    console.log("🔍 Fetching handover notifications for user:", req.user.id);

    const notifications = await HandoverNotification.find({
      toUser: req.user.id,
      status: "pending",
    })
      .populate({
        path: "fromUser",
        select: "firstName lastName username",
        options: { strictPopulate: false }
      })
      .populate({
        path: "toUser", 
        select: "firstName lastName username",
        options: { strictPopulate: false }
      })
      .populate({
        path: "lotoId",
        select: "isolatedPart reason shift line date serialNumber",
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    // Filter out notifications with missing references
    const validNotifications = notifications.filter(notification => 
      notification.fromUser && 
      notification.toUser && 
      notification.lotoId
    );

    console.log("📊 Found notifications:", notifications.length);
    console.log("✅ Valid notifications:", validNotifications.length);
    console.log("❌ Invalid notifications:", notifications.length - validNotifications.length);

    res.status(200).json({
      success: true,
      count: validNotifications.length,
      notifications: validNotifications, // Return only valid notifications
      data: { notifications: validNotifications }, // Added for consistency
    });
  } catch (error) {
    console.error("❌ Get notifications error:", error);
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
    console.log("✅ Handover notification accepted:", notification._id);

    // Update LOTO to transfer ownership
    const loto = await LOTO.findById(notification.lotoId);
    if (loto) {
      loto.status = "pending";
      loto.isolator = req.user.id;
      loto.isolatorName = `${req.user.firstName} ${req.user.lastName}`;
      loto.handoverTo = null; // Clear handoverTo field
      
      // Update handover history - mark the latest handover as accepted
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        const latestHandover = loto.handoverHistory[loto.handoverHistory.length - 1];
        if (latestHandover.status === "pending") {
          latestHandover.status = "accepted";
          latestHandover.responseDate = new Date();
        }
      }
      
      await loto.save();
      console.log("✅ LOTO ownership transferred:", loto._id);
    } else {
      console.error("❌ LOTO not found for notification:", notification.lotoId);
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
    console.log("✅ Handover notification rejected:", notification._id);

    // Update LOTO status back to active (cancel handover)
    const loto = await LOTO.findById(notification.lotoId);
    if (loto) {
      loto.status = "active";
      loto.handoverTo = null; // Clear handoverTo field
      
      // Update handover history - mark the latest handover as rejected
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        const latestHandover = loto.handoverHistory[loto.handoverHistory.length - 1];
        if (latestHandover.status === "pending") {
          latestHandover.status = "rejected";
          latestHandover.responseDate = new Date();
        }
      }
      
      await loto.save();
      console.log("✅ LOTO status reset to active:", loto._id);
    } else {
      console.error("❌ LOTO not found for notification:", notification.lotoId);
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
