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

// @desc    Mark notification as read
// @route   PUT /api/notifications/handover/:id/read
// @access  Private
exports.markNotificationAsRead = async (req, res) => {
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
        message: "Not authorized to read this notification",
      });
    }

    // Mark as read
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/handover/read-all
// @access  Private
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await HandoverNotification.updateMany(
      {
        toUser: req.user.id,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete all notifications (soft delete - mark as deleted)
// @route   DELETE /api/notifications/handover/delete-all
// @access  Private
exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await HandoverNotification.deleteMany({
      toUser: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get notification count (unread only)
// @route   GET /api/notifications/handover/count
// @access  Private
exports.getNotificationCount = async (req, res) => {
  try {
    console.log("🔍 Getting notification count for user:", req.user.id);
    
    const count = await HandoverNotification.countDocuments({
      toUser: req.user.id,
      status: "pending",
      $or: [
        { read: false },
        { read: { $exists: false } } // Handle notifications created before read field was added
      ]
    });

    console.log("📊 Notification count result:", count);

    res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error("❌ Get notification count error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get ALL handover notifications (Admin Only - for database export)
// @route   GET /api/notifications/handover/all
// @access  Private (Admin Only)
exports.getAllHandoverNotifications = async (req, res) => {
  try {
    console.log("🔍 Admin fetching ALL handover notifications");

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const notifications = await HandoverNotification.find({})
      .populate({
        path: "fromUser",
        select: "firstName lastName email username",
        options: { strictPopulate: false }
      })
      .populate({
        path: "toUser", 
        select: "firstName lastName email username",
        options: { strictPopulate: false }
      })
      .populate({
        path: "lotoId",
        select: "isolatedPart reason shift line date serialNumber location",
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    console.log("📊 Total notifications found:", notifications.length);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Get all notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
