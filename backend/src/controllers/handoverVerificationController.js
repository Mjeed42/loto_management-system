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
    } else {
      // If rejected by recipient, return to active status with the person who initiated this handover
      loto.status = "active";
      // Return LOTO to the person who initiated this handover (fromUser)
      loto.currentResponsible = handover.fromUser;
      loto.currentResponsibleName = handover.fromUserName;
      
      console.log(`🔄 Handover rejected by ${handover.toUserName}, returning LOTO to ${handover.fromUserName}`);
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
      // If rejected by supervisor, return LOTO to the person who initiated this handover
      loto.status = "active";
      loto.currentResponsible = handover.fromUser;
      loto.currentResponsibleName = handover.fromUserName;
      
      console.log(`🔄 Handover rejected by supervisor, returning LOTO to ${handover.fromUserName}`);
    } else {
      // If approved, handover is complete - update status and responsible
      loto.status = "active"; // Return to active status with new owner
      loto.currentResponsible = handover.toUser;
      loto.currentResponsibleName = handover.toUserName;
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
