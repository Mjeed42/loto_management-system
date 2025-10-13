const LOTO = require("../models/LOTO");

// @desc    Recipient decision on handover (accept or reject)
// @route   PUT /api/loto/:id/handover/:handoverIndex/recipient-decision
// @access  Private
exports.recipientDecision = async (req, res) => {
  try {
    const { id, handoverIndex } = req.params;
    const { action, decisionNotes } = req.body;

    // Validate action
    if (!action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'accept' or 'reject'",
      });
    }

    const loto = await LOTO.findById(id).populate("isolator", "firstName lastName email");
    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    const handoverIndexNum = parseInt(handoverIndex);
    if (!loto.handoverHistory || handoverIndexNum < 0 || handoverIndexNum >= loto.handoverHistory.length) {
      return res.status(404).json({
        success: false,
        message: "Handover not found",
      });
    }

    const handover = loto.handoverHistory[handoverIndexNum];

    // Check if user is the recipient
    if (handover.toUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the handover recipient can make this decision",
      });
    }

    // Check if handover is already decided by recipient
    if (handover.recipientStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Handover recipient decision is already ${handover.recipientStatus}`,
      });
    }

    // Update recipient decision
    handover.recipientStatus = action === "accept" ? "accepted" : "rejected";
    handover.recipientDecisionDate = new Date();
    handover.recipientDecisionNotes = decisionNotes || "";

    // If accepted, keep status as pending_handover_verification for supervisor approval
    if (action === "accept") {
      // Status remains pending_handover_verification until supervisor approves
      // No status change needed here
      
      // Delete any previous rejection snapshots this user has for this LOTO
      try {
        const deletedSnapshots = await LOTO.deleteMany({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.toUser,
          isSnapshot: true,
          status: "rejected_handover_snapshot"
        });
        
        if (deletedSnapshots.deletedCount > 0) {
          console.log(`🗑️ Deleted ${deletedSnapshots.deletedCount} old snapshot(s) - ${handover.toUserName} accepted handover`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old snapshots:", cleanupError);
        // Continue even if cleanup fails
      }
    } else {
      // If rejected by recipient, create a snapshot for the recipient and return original to sender
      
      // Delete any previous snapshots from this user for this LOTO (to avoid duplicates)
      try {
        const existingSnapshots = await LOTO.find({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.toUser,
          isSnapshot: true,
          status: "rejected_handover_snapshot"
        });
        
        if (existingSnapshots.length > 0) {
          await LOTO.deleteMany({
            _id: { $in: existingSnapshots.map(s => s._id) }
          });
          console.log(`🗑️ Deleted ${existingSnapshots.length} old snapshot(s) for ${handover.toUserName} - creating new one`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old snapshots:", cleanupError);
        // Continue with snapshot creation even if cleanup fails
      }
      
      // Create a snapshot copy for the recipient (person who rejected it)
      const snapshotData = loto.toObject();
      delete snapshotData._id;
      delete snapshotData.__v;
      
      // Generate more readable serial number
      const timestamp = new Date().toISOString().split('T')[0]; // 2025-01-12
      const userInitials = handover.toUserName.split(' ').map(n => n[0]).join(''); // BA for Bashaer Al
      
      // Modify snapshot to be read-only
      snapshotData.isSnapshot = true;
      snapshotData.originalLotoId = loto._id;
      snapshotData.snapshotReason = "handover_rejected_by_recipient";
      snapshotData.snapshotCreatedAt = new Date();
      snapshotData.snapshotCreatedFor = handover.toUser;
      snapshotData.snapshotCreatedForName = handover.toUserName;
      snapshotData.status = "rejected_handover_snapshot";
      snapshotData.serialNumber = `${loto.serialNumber}-SNAPSHOT-${userInitials}-${timestamp}`;
      // DON'T set currentResponsible on snapshots - they're read-only and filtered by snapshotCreatedFor
      snapshotData.currentResponsible = null;
      snapshotData.currentResponsibleName = null;
      
      try {
        const snapshot = new LOTO(snapshotData);
        await snapshot.save();
        console.log(`📸 Snapshot created for ${handover.toUserName}: ${snapshot.serialNumber}`);
      } catch (snapshotError) {
        console.error("❌ Error creating snapshot:", snapshotError);
        // Continue with the original LOTO update even if snapshot fails
      }
      
      // Return original LOTO to the person who initiated this handover
      loto.status = "active";
      loto.currentResponsible = handover.fromUser;
      loto.currentResponsibleName = handover.fromUserName;
      
      // Clear handover fields since rejection returns to original state
      loto.handoverTo = null;
      loto.handoverNotes = null;
      
      console.log(`🔄 Handover rejected by ${handover.toUserName}, returning LOTO to ${handover.fromUserName}`);
      console.log(`🔍 Debug - Setting currentResponsible:`, {
        fromUser: handover.fromUser,
        fromUserName: handover.fromUserName,
        toUser: handover.toUser,
        toUserName: handover.toUserName,
        currentResponsible: loto.currentResponsible,
        currentResponsibleName: loto.currentResponsibleName
      });
    }

    await loto.save();
    console.log(`✅ LOTO saved. Current responsible is now: ${loto.currentResponsibleName}`);

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(id)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email")
      .populate("currentResponsible", "firstName lastName email")
      .populate("handoverHistory.fromUser", "firstName lastName email")
      .populate("handoverHistory.toUser", "firstName lastName email")
      .populate("handoverHistory.verifiedBy", "firstName lastName email");

    res.json({
      success: true,
      message: `Handover ${action}ed by recipient successfully`,
      data: updatedLOTO,
    });
  } catch (error) {
    console.error("❌ Recipient decision error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Verify handover (approve or reject)
// @route   PUT /api/loto/:id/handover/:handoverIndex/verify
// @access  Private (Supervisor/Admin only)
exports.verifyHandover = async (req, res) => {
  try {
    const { id, handoverIndex } = req.params;
    const { action, verificationNotes, rejectionReason } = req.body;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'approve' or 'reject'",
      });
    }

    const loto = await LOTO.findById(id)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email");
    
    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Check if user is authorized (admin or the authorized supervisor for this LOTO)
    const isAdmin = req.user.role === "admin";
    const isAuthorizedSupervisor = req.user.role === "supervisor" && 
                                   loto.supervisor && 
                                   loto.supervisor._id.toString() === req.user.id;

    if (!isAdmin && !isAuthorizedSupervisor) {
      return res.status(403).json({
        success: false,
        message: "Only admins and the authorized supervisor can verify handovers",
      });
    }

    const handoverIndexNum = parseInt(handoverIndex);
    if (!loto.handoverHistory || handoverIndexNum < 0 || handoverIndexNum >= loto.handoverHistory.length) {
      return res.status(404).json({
        success: false,
        message: "Handover not found",
      });
    }

    const handover = loto.handoverHistory[handoverIndexNum];

    // Check if handover is already verified
    if (handover.verificationStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Handover is already ${handover.verificationStatus}`,
      });
    }

    // Check if recipient has accepted the handover
    if (handover.recipientStatus !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Cannot verify handover until recipient accepts it",
      });
    }

    // Update verification details
    handover.verificationStatus = action === "approve" ? "approved" : "rejected";
    handover.verifiedBy = req.user.id;
    handover.verifiedByName = `${req.user.firstName} ${req.user.lastName}`;
    handover.verificationDate = new Date();
    handover.verificationNotes = verificationNotes || "";

    if (action === "reject") {
      handover.rejectionReason = rejectionReason || "";
      
      // Delete any previous snapshots from this user for this LOTO (to avoid duplicates)
      try {
        const existingSnapshots = await LOTO.find({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.toUser,
          isSnapshot: true,
          status: "rejected_handover_snapshot"
        });
        
        if (existingSnapshots.length > 0) {
          await LOTO.deleteMany({
            _id: { $in: existingSnapshots.map(s => s._id) }
          });
          console.log(`🗑️ Deleted ${existingSnapshots.length} old snapshot(s) for ${handover.toUserName} - supervisor rejection`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old snapshots:", cleanupError);
        // Continue with snapshot creation even if cleanup fails
      }
      
      // Create a snapshot copy for the recipient (person who would have received it)
      const snapshotData = loto.toObject();
      delete snapshotData._id;
      delete snapshotData.__v;
      
      // Generate more readable serial number
      const timestamp = new Date().toISOString().split('T')[0]; // 2025-01-12
      const userInitials = handover.toUserName.split(' ').map(n => n[0]).join(''); // BA for Bashaer Al
      
      // Modify snapshot to be read-only
      snapshotData.isSnapshot = true;
      snapshotData.originalLotoId = loto._id;
      snapshotData.snapshotReason = "handover_rejected_by_supervisor";
      snapshotData.snapshotCreatedAt = new Date();
      snapshotData.snapshotCreatedFor = handover.toUser;
      snapshotData.snapshotCreatedForName = handover.toUserName;
      snapshotData.status = "rejected_handover_snapshot";
      snapshotData.serialNumber = `${loto.serialNumber}-SNAPSHOT-${userInitials}-${timestamp}`;
      // DON'T set currentResponsible on snapshots - they're read-only and filtered by snapshotCreatedFor
      snapshotData.currentResponsible = null;
      snapshotData.currentResponsibleName = null;
      
      try {
        const snapshot = new LOTO(snapshotData);
        await snapshot.save();
        console.log(`📸 Snapshot created for ${handover.toUserName}: ${snapshot.serialNumber}`);
      } catch (snapshotError) {
        console.error("❌ Error creating snapshot:", snapshotError);
        // Continue with the original LOTO update even if snapshot fails
      }
      
      // If rejected by supervisor, return LOTO to the person who initiated this handover
      loto.status = "active";
      loto.currentResponsible = handover.fromUser;
      loto.currentResponsibleName = handover.fromUserName;
      
      // Clear handover fields since rejection returns to original state
      loto.handoverTo = null;
      loto.handoverNotes = null;
      
      console.log(`🔄 Handover rejected by supervisor, returning LOTO to ${handover.fromUserName}`);
    } else {
      // If approved, handover is complete - update status and responsible
      loto.status = "active"; // Return to active status with new owner
      loto.currentResponsible = handover.toUser;
      loto.currentResponsibleName = handover.toUserName;
      
      // Clear handover fields since handover is complete
      loto.handoverTo = null;
      loto.handoverNotes = null;
      
      // Delete any previous rejection snapshots this user has for this LOTO
      // (in case they rejected before, then accepted, and now it's approved)
      try {
        const deletedSnapshots = await LOTO.deleteMany({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.toUser,
          isSnapshot: true,
          status: "rejected_handover_snapshot"
        });
        
        if (deletedSnapshots.deletedCount > 0) {
          console.log(`🗑️ Deleted ${deletedSnapshots.deletedCount} old snapshot(s) - ${handover.toUserName} handover approved`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old snapshots:", cleanupError);
        // Continue even if cleanup fails
      }
    }

    await loto.save();

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(id)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email")
      .populate("currentResponsible", "firstName lastName email")
      .populate("handoverHistory.fromUser", "firstName lastName email")
      .populate("handoverHistory.toUser", "firstName lastName email")
      .populate("handoverHistory.verifiedBy", "firstName lastName email");

    res.json({
      success: true,
      message: `Handover ${action}d successfully`,
      data: updatedLOTO,
    });
  } catch (error) {
    console.error("❌ Verify handover error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
