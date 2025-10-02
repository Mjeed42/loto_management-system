const LOTO = require("../models/LOTO");
const User = require("../models/User");

// Helper function to generate unique serial number
const generateSerialNumber = async () => {
  try {
    // Format: LOTO-YYYYMMDD-XXXX (where XXXX is a 4-digit sequential number)
    const datePrefix = `LOTO-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}`;

    // Find the highest existing serial number for today
    const todayRegex = new RegExp(`^${datePrefix}-\\d{4}$`);
    const latestLOTO = await LOTO.findOne({
      serialNumber: todayRegex,
    }).sort({ serialNumber: -1 });

    let nextNumber = 1;
    if (latestLOTO) {
      const lastNumber = parseInt(latestLOTO.serialNumber.slice(-4));
      nextNumber = lastNumber + 1;
    }

    // Format as 4-digit number with leading zeros
    const formattedNumber = nextNumber.toString().padStart(4, "0");
    return `${datePrefix}-${formattedNumber}`;
  } catch (error) {
    console.error("Generate serial number error:", error);
    throw new Error("Failed to generate serial number");
  }
};

// @desc    Create new LOTO
// @route   POST /api/loto
// @access  Private
exports.createLOTO = async (req, res) => {
  try {
    const {
      shift,
      location,
      line, // 👈 Save it
      machine,
      isolatedPart,
      reason,
      ptwNumber,
      expectedDuration,
      supervisor,
      energyTypes,
    } = req.body;

    // Destructure line and machine from location if available

    const serialNumber = await generateSerialNumber();

    // Generate unique serial number
    // Prepare LOTO data
    const lotoData = {
      serialNumber,
      shift,
      isolator: req.user.id,
      isolatorName: `${req.user.firstName} ${req.user.lastName}`,
      location: location || "Other", // Default to 'Other' if not provided
      isolatedPart,
      line: req.body.line, // 👈 Save it
      machine: req.body.machine, // 👈 Save it
      reason,
      ptwNumber: ptwNumber || "N/A",
      expectedDuration: parseFloat(expectedDuration),
      status: "pending_verification_new",
    };
    // --- ADD ENERGY TYPES TO LOTO DATA ---
    if (energyTypes && Array.isArray(energyTypes)) {
      // Filter out any empty energy types
      const filteredEnergyTypes = energyTypes.filter(
        (et) => et.type && et.isolationPoint
      );
      if (filteredEnergyTypes.length > 0) {
        lotoData.energyTypes = filteredEnergyTypes;
      }
    }
    // --- END ADD ENERGY TYPES ---

    console.log("Creating LOTO with ", lotoData);
    
    // Add authorized handler if provided
    if (supervisor) {
      // Validate that the supervisor exists and is a supervisor
      const supervisorUser = await User.findById(supervisor);
      if (supervisorUser && supervisorUser.role === "supervisor") {
        lotoData.supervisor = supervisor;
        lotoData.supervisorName = `${supervisorUser.firstName} ${supervisorUser.lastName}`;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid supervisor - must be a technician",
        });
      }
    }

    const loto = await LOTO.create(lotoData);

    // Populate the created LOTO
    const populatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("supervisor", "firstName lastName username") // NEW POPULATION
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(201).json({
      success: true,
      populatedLOTO,
    });
  } catch (error) {
    console.error("Create LOTO error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get all LOTOs
// @route   GET /api/loto
// @access  Private
exports.getLOTOs = async (req, res) => {
  try {
    let query = {};

    // Technicians only see their own LOTOs
    if (req.user.role === "technician") {
      query.$or = [{ isolator: req.user.id }, { handoverTo: req.user.id }];
    }

    const lotos = await LOTO.find(query)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("rejectedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lotos.length,
      data: lotos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single LOTO
// @route   GET /api/loto/:id
// @access  Private
exports.getLOTO = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("rejectedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Check if user has permission to view this LOTO
    if (
      req.user.role === "technician" &&
      loto.isolator._id.toString() !== req.user.id &&
      loto.handoverTo?._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this LOTO",
      });
    }

    res.status(200).json({
      success: true,
      data: loto,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update LOTO status (for verification)
// @route   PUT /api/loto/:id/verify
// @access  Private (supervisors/admins)
exports.verifyLOTO = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Check if this LOTO has a specific supervisor assigned
    if (loto.supervisor) {
      // Prevent supervisor from verifying their own LOTO
      if (loto.supervisor.toString() === loto.isolator.toString()) {
        return res.status(403).json({
          success: false,
          message: "Supervisor cannot verify their own LOTO",
        });
      }
      // Only the assigned supervisor or admin can verify
      if (
        loto.supervisor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Not authorized to verify this LOTO - assigned to different supervisor",
        });
      }
    } else {
      // If no supervisor assigned, only supervisors and admins can verify
      if (req.user.role !== "supervisor" && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to verify LOTO",
        });
      }
      // Prevent supervisor from verifying their own LOTO
      if (
        req.user.role === "supervisor" &&
        loto.isolator.toString() === req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Supervisor cannot verify their own LOTO",
        });
      }
    }

    // Check if this is initial verification or handover verification
    if (loto.status === "pending_verification_new") {
      // Initial verification of new LOTO
      loto.status = "active";
      loto.verifiedBy = req.user.id;
      loto.verifiedAt = Date.now();
    } else if (loto.status === "pending_handover_verification") {
      // Handover verification - this should be handled by handover verification controller
      return res.status(400).json({
        success: false,
        message: "Use handover verification endpoint for handover approvals",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Cannot verify LOTO with status: ${loto.status}`,
      });
    }

    await loto.save();

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("supervisor", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update LOTO
// @route   PUT /api/loto/:id
// @access  Private
exports.updateLOTO = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Only the isolator, handover recipient, or admin can update
    // Also allow updates if LOTO is rejected and user is the original isolator
    const canUpdate = 
      loto.isolator.toString() === req.user.id ||
      loto.handoverTo?.toString() === req.user.id ||
      req.user.role === "admin" ||
      (loto.status === "rejected" && loto.isolator.toString() === req.user.id);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this LOTO",
      });
    }

    // Determine what fields can be updated based on LOTO status
    let allowedFields = [];
    
    // ADMIN OVERRIDE: Admins can update ANY field in ANY condition
    if (req.user.role === "admin") {
      allowedFields = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    } else if (loto.status === "pending_verification_new") {
      // New LOTO pending verification: can update ALL fields
      allowedFields = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    } else if (loto.status === "pending_handover_verification") {
      // LOTO under handover verification: only expectedDuration and supervisor
      allowedFields = ["expectedDuration", "supervisor"];
    } else if (loto.status === "rejected") {
      // Rejected LOTOs: only the fields that were rejected
      allowedFields = loto.rejectedFields || [];
    }

    // Extract all possible fields from request body
    const {
      shift,
      location,
      line,
      machine,
      isolatedPart,
      reason,
      ptwNumber,
      expectedDuration,
      supervisor,
      energyTypes,
    } = req.body;

    // Validate that only allowed fields are being updated
    const requestedFields = Object.keys(req.body).filter(key => req.body[key] !== undefined);
    const unauthorizedFields = requestedFields.filter(field => !allowedFields.includes(field));
    
    if (unauthorizedFields.length > 0) {
      return res.status(403).json({
        success: false,
        message: `You can only update the following fields: ${allowedFields.join(", ")}. Attempted to update: ${unauthorizedFields.join(", ")}`,
      });
    }

    // Update allowed fields
    if (allowedFields.includes("shift") && shift !== undefined) {
      loto.shift = shift;
    }
    if (allowedFields.includes("location") && location !== undefined) {
      loto.location = location;
    }
    if (allowedFields.includes("line") && line !== undefined) {
      loto.line = line;
    }
    if (allowedFields.includes("machine") && machine !== undefined) {
      loto.machine = machine;
    }
    if (allowedFields.includes("isolatedPart") && isolatedPart !== undefined) {
      loto.isolatedPart = isolatedPart;
    }
    if (allowedFields.includes("reason") && reason !== undefined) {
      loto.reason = reason;
    }
    if (allowedFields.includes("ptwNumber") && ptwNumber !== undefined) {
      loto.ptwNumber = ptwNumber;
    }
    if (allowedFields.includes("expectedDuration") && expectedDuration !== undefined) {
      loto.expectedDuration = parseFloat(expectedDuration);
    }
    if (allowedFields.includes("energyTypes") && energyTypes !== undefined) {
      if (energyTypes && Array.isArray(energyTypes)) {
        const filteredEnergyTypes = energyTypes.filter(
          (et) => et.type && et.isolationPoint
        );
        if (filteredEnergyTypes.length > 0) {
          loto.energyTypes = filteredEnergyTypes;
        }
      }
    }

    // Handle supervisor assignment updates
    if (allowedFields.includes("supervisor") && supervisor !== undefined) {
      if (supervisor === "") {
        // Clear supervisor assignment
        loto.supervisor = null;
        loto.supervisorName = null;
      } else {
        // Validate supervisor exists and has correct role
        const supervisorUser = await User.findById(supervisor);
        if (!supervisorUser) {
          return res.status(404).json({
            success: false,
            message: "Supervisor user not found",
          });
        }

        if (
          supervisorUser.role !== "supervisor" &&
          supervisorUser.role !== "admin"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "User must be a supervisor or admin to be assigned as supervisor",
          });
        }

        loto.supervisor = supervisor;
        loto.supervisorName = `${supervisorUser.firstName} ${supervisorUser.lastName}`;
      }
    }

    // If LOTO was rejected and is being updated, reset status to pending verification
    if (loto.status === "rejected") {
      loto.status = "pending_verification_new";
      loto.rejectedBy = null;
      loto.rejectedAt = null;
      loto.rejectionNotes = null;
      loto.rejectedFields = [];
      
      // Mark the latest rejection as resolved
      if (loto.rejectionHistory && loto.rejectionHistory.length > 0) {
        const latestRejection = loto.rejectionHistory[loto.rejectionHistory.length - 1];
        latestRejection.resolvedAt = Date.now();
      }
    }

    loto.updatedAt = Date.now();
    await loto.save();

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username")
      .populate("supervisor", "firstName lastName username"); // NEW POPULATION

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// @desc    Complete LOTO
// @route   PUT /api/loto/:id/complete
// @access  Private
exports.completeLOTO = async (req, res) => {
  try {
    console.log("Complete LOTO request received:", req.params.id, req.body);

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    console.log("Found LOTO:", loto._id);
    console.log("User ID:", req.user.id);
    console.log("LOTO Isolator:", loto.isolator.toString());

    // Only the isolator or handover recipient can complete
    if (
      loto.isolator.toString() !== req.user.id &&
      loto.handoverTo?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this LOTO",
      });
    }

    const { actualFinishTime, actualFinishDate, completionNotes } = req.body;

    console.log("Completion ", {
      actualFinishTime,
      actualFinishDate,
      completionNotes,
    });

    // Update LOTO
    loto.status = "completed";

    // Handle date/time properly
    if (actualFinishTime) {
      loto.actualFinishTime = new Date(actualFinishTime);
    }
    if (actualFinishDate) {
      loto.actualFinishDate = new Date(actualFinishDate);
    }
    if (completionNotes) {
      loto.completionNotes = completionNotes;
    }

    // If no dates provided, use current date
    if (!loto.actualFinishTime) {
      loto.actualFinishTime = new Date();
    }
    if (!loto.actualFinishDate) {
      loto.actualFinishDate = new Date();
    }

    await loto.save();

    console.log("LOTO completed successfully");

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      data: updatedLOTO,
    });
  } catch (error) {
    console.error("Complete LOTO error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Handover LOTO
// @route   PUT /api/loto/:id/handover
// @access  Private
exports.handoverLOTO = async (req, res) => {
  try {
    console.log("Handover request received:", req.params.id, req.body);

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      console.log("LOTO not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    console.log("Found LOTO:", loto._id);
    console.log("User ID:", req.user.id);
    console.log("LOTO Isolator:", loto.isolator.toString());

    // Only the isolator can initiate handover
    if (loto.isolator.toString() !== req.user.id && req.user.role !== "admin") {
      console.log("Unauthorized handover attempt");
      return res.status(403).json({
        success: false,
        message: "Not authorized to handover this LOTO",
      });
    }

    const { handoverTo, handoverNotes } = req.body;
    console.log("Handover data:", { handoverTo, handoverNotes });

    // Validate handover recipient
    const recipient = await User.findById(handoverTo);
    if (!recipient) {
      console.log("Recipient not found:", handoverTo);
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }

    console.log("Recipient found:", recipient.username);

    // Update LOTO - set to handover status but don't change ownership yet
    loto.status = "pending_handover";
    loto.handoverTo = handoverTo;
    if (handoverNotes) loto.handoverNotes = handoverNotes;

    // Add handover to history
    const handoverHistoryEntry = {
      fromUser: req.user.id,
      fromUserName: `${req.user.firstName} ${req.user.lastName}`,
      toUser: handoverTo,
      toUserName: `${recipient.firstName} ${recipient.lastName}`,
      handoverNotes: handoverNotes,
      status: "pending",
      handoverDate: new Date(),
    };

    // Add to handover history
    if (!loto.handoverHistory) {
      loto.handoverHistory = [];
    }
    loto.handoverHistory.push(handoverHistoryEntry);

    await loto.save();
    console.log("✅ LOTO updated for handover with history recorded");

    // Create handover notification and link to history
    try {
      const HandoverNotification = require("../models/HandoverNotification");
      const notification = await HandoverNotification.create({
        lotoId: loto._id,
        fromUser: req.user.id,
        toUser: handoverTo,
        lotoDetails: {
          isolatedPart: loto.isolatedPart,
          reason: loto.reason,
          shift: loto.shift,
          line: loto.line,
        },
        handoverNotes: handoverNotes,
      });
      
      // Update the handover history entry with notification ID
      const lastHistoryEntry = loto.handoverHistory[loto.handoverHistory.length - 1];
      lastHistoryEntry.notificationId = notification._id;
      await loto.save();
      
      console.log("✅ Handover notification created successfully:", notification._id);
      console.log("✅ Handover history updated with notification ID");
    } catch (notificationError) {
      console.error("❌ Failed to create handover notification:", notificationError);
      // Don't fail the entire handover process, but log the error for debugging
      console.error("Notification creation error details:", {
        lotoId: loto._id,
        fromUser: req.user.id,
        toUser: handoverTo,
        error: notificationError.message,
        stack: notificationError.stack
      });
    }

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    console.error("Handover error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Accept Handover
// @route   PUT /api/loto/:id/accept-handover
// @access  Private
exports.acceptHandover = async (req, res) => {
  try {
    console.log("Accept handover request received:", req.params.id);

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      console.log("LOTO not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Only the handover recipient can accept
    if (loto.handoverTo?.toString() !== req.user.id) {
      console.log("Unauthorized handover acceptance attempt");
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this handover",
      });
    }

    // Update LOTO - Reset to pending status for re-verification
    loto.status = "pending_verification_new"; // Changed from 'active' to 'pending_verification_new'
    loto.isolator = req.user.id;
    loto.isolatorName = `${req.user.firstName} ${req.user.lastName}`;
    loto.verifiedBy = null; // Clear previous verification
    loto.verifiedAt = null; // Clear previous verification timestamp
    loto.handoverTo = null; // Clear handover recipient
    loto.handoverNotes = null; // Clear handover notes
    loto.updatedAt = Date.now();

    await loto.save();

    console.log(
      "LOTO handover accepted and reset to pending for re-verification"
    );

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    console.error("Accept handover error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete LOTO
// @route   DELETE /api/loto/:id
// @access  Private
exports.deleteLOTO = async (req, res) => {
  try {
    console.log("Delete LOTO request received:", req.params.id);
    console.log("User making request:", req.user.id, req.user.role);

    // Only admin can delete LOTOs
    if (req.user.role !== "admin") {
      console.log("UNAUTHORIZED: User is not admin - role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      console.log("LOTO not found for deletion:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    console.log("Found LOTO for deletion:", loto._id, loto.serialNumber);

    // Use deleteOne() instead of remove() (deprecated in newer Mongoose versions)
    await LOTO.deleteOne({ _id: req.params.id });

    console.log("LOTO deleted successfully:", req.params.id);

    res.status(200).json({
      success: true,
      message: "LOTO deleted successfully",
    });
  } catch (error) {
    console.error("Delete LOTO error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// @desc    Reject Handover
// @route   PUT /api/loto/:id/reject-handover
// @access  Private
exports.rejectHandover = async (req, res) => {
  try {
    console.log("Reject handover request received:", req.params.id);

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      console.log("LOTO not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Only the handover recipient can reject
    if (loto.handoverTo?.toString() !== req.user.id) {
      console.log("Unauthorized handover rejection attempt");
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this handover",
      });
    }

    // Update LOTO - Reset to active status for original isolator
    loto.status = "active";
    loto.handoverTo = null;
    loto.handoverNotes = null;
    loto.updatedAt = Date.now();

    await loto.save();

    console.log("LOTO handover rejected and reset to active status");

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    console.error("Reject handover error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Reject LOTO with notes
// @route   PUT /api/loto/:id/reject
// @access  Private (supervisors/admins)
exports.rejectLOTO = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Check if this LOTO has a specific supervisor assigned
    if (loto.supervisor) {
      // Prevent supervisor from rejecting their own LOTO
      if (loto.supervisor.toString() === loto.isolator.toString()) {
        return res.status(403).json({
          success: false,
          message: "Supervisor cannot reject their own LOTO",
        });
      }
      // Only the assigned supervisor or admin can reject
      if (
        loto.supervisor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Not authorized to reject this LOTO - assigned to different supervisor",
        });
      }
    } else {
      // If no supervisor assigned, only supervisors and admins can reject
      if (req.user.role !== "supervisor" && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to reject LOTO",
        });
      }
      // Prevent supervisor from rejecting their own LOTO
      if (
        req.user.role === "supervisor" &&
        loto.isolator.toString() === req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Supervisor cannot reject their own LOTO",
        });
      }
    }

    const { rejectionNotes, rejectedFields } = req.body;

    if (!rejectionNotes || rejectionNotes.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rejection notes are required",
      });
    }

    // Validate rejected fields if provided
    const validFields = [
      "shift", "location", "line", "machine", "isolatedPart", 
      "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
    ];
    
    if (rejectedFields && Array.isArray(rejectedFields)) {
      const invalidFields = rejectedFields.filter(field => !validFields.includes(field));
      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid rejected fields: ${invalidFields.join(", ")}`,
        });
      }
    }

    // Update LOTO
    loto.status = "rejected";
    loto.rejectedBy = req.user.id;
    loto.rejectedAt = Date.now();
    loto.rejectionNotes = rejectionNotes;
    loto.rejectedFields = rejectedFields || [];

    // Add to rejection history
    const rejectionHistoryEntry = {
      rejectedBy: req.user.id,
      rejectedByName: `${req.user.firstName} ${req.user.lastName}`,
      rejectionNotes: rejectionNotes,
      rejectedFields: rejectedFields || [],
      rejectedAt: Date.now(),
    };

    if (!loto.rejectionHistory) {
      loto.rejectionHistory = [];
    }
    loto.rejectionHistory.push(rejectionHistoryEntry);

    await loto.save();

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("supervisor", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("rejectedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username");

    res.status(200).json({
      success: true,
      updatedLOTO,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get handover history for a LOTO
// @route   GET /api/loto/:id/handover-history
// @access  Private
exports.getHandoverHistory = async (req, res) => {
  try {
    console.log("🔍 Fetching handover history for LOTO:", req.params.id);

    const loto = await LOTO.findById(req.params.id)
      .populate("handoverHistory.fromUser", "firstName lastName username")
      .populate("handoverHistory.toUser", "firstName lastName username")
      .select("serialNumber handoverHistory");

    if (!loto) {
      console.log("❌ LOTO not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    console.log("📊 Found handover history entries:", loto.handoverHistory?.length || 0);

    res.status(200).json({
      success: true,
      data: {
        lotoId: loto._id,
        serialNumber: loto.serialNumber,
        handoverHistory: loto.handoverHistory || [],
        totalHandovers: loto.handoverHistory?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Get handover history error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Change LOTO status (Admin only)
// @route   PUT /api/loto/:id/status
// @access  Private (admin only)
exports.changeLOTOStatus = async (req, res) => {
  try {
    // Only admins can change status
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can change LOTO status",
      });
    }

    const loto = await LOTO.findById(req.params.id);

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    const { status, notes, additionalData } = req.body;

    // Validate status
    const validStatuses = ["pending_verification_new", "active", "completed", "pending_handover_verification", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const oldStatus = loto.status;
    loto.status = status;
    loto.updatedAt = Date.now();

    // Update LOTO with additional data based on status
    if (additionalData) {
      switch (status) {
        case 'active':
          if (additionalData.assignedTechnician) loto.assignedTechnician = additionalData.assignedTechnician;
          if (additionalData.workStartTime) loto.workStartTime = new Date(additionalData.workStartTime);
          if (additionalData.estimatedCompletion) loto.estimatedCompletion = new Date(additionalData.estimatedCompletion);
          break;
        case 'completed':
          if (additionalData.completionTime) loto.completionTime = new Date(additionalData.completionTime);
          if (additionalData.completedBy) loto.completedBy = additionalData.completedBy;
          if (additionalData.workSummary) loto.workSummary = additionalData.workSummary;
          break;
        case 'pending_handover':
          if (additionalData.handoverTo) loto.handoverTo = additionalData.handoverTo;
          if (additionalData.handoverReason) loto.handoverReason = additionalData.handoverReason;
          break;
        case 'rejected':
          if (additionalData.rejectionReason) loto.rejectionReason = additionalData.rejectionReason;
          if (additionalData.rejectedFields) loto.rejectedFields = additionalData.rejectedFields;
          loto.rejectedBy = req.user.id;
          loto.rejectedAt = Date.now();
          loto.rejectionNotes = additionalData.rejectionReason;
          break;
      }
    }

    // Always add status change to history
    if (!loto.statusHistory) {
      loto.statusHistory = [];
    }
    loto.statusHistory.push({
      changedBy: req.user.id,
      changedByName: `${req.user.firstName} ${req.user.lastName}`,
      oldStatus: oldStatus,
      newStatus: status,
      notes: notes ? notes.trim() : '',
      additionalData: additionalData || {},
      changedAt: Date.now(),
    });

    await loto.save();

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(req.params.id)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email")
      .populate("handoverTo", "firstName lastName email")
      .populate("verifiedBy", "firstName lastName email")
      .populate("rejectedBy", "firstName lastName email");

    res.json({
      success: true,
      message: `LOTO status changed from ${oldStatus} to ${status}`,
      data: updatedLOTO,
    });
  } catch (error) {
    console.error("❌ Change LOTO status error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get admin actions for data export
// @route   GET /api/loto/admin-actions
// @access  Private (admin only)
exports.getAdminActions = async (req, res) => {
  try {
    // Only admins can access this data
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access admin actions data",
      });
    }

    const { startDate, endDate, actionType } = req.query;

    // Build query for LOTOs with status history
    let query = {
      statusHistory: { $exists: true, $ne: [] }
    };

    // Add date filter if provided
    if (startDate && endDate) {
      query["statusHistory.changedAt"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const lotos = await LOTO.find(query)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email")
      .populate("handoverTo", "firstName lastName email")
      .populate("verifiedBy", "firstName lastName email")
      .populate("rejectedBy", "firstName lastName email")
      .sort({ updatedAt: -1 });

    // Extract admin actions from status history
    const adminActions = [];
    
    lotos.forEach(loto => {
      if (loto.statusHistory && loto.statusHistory.length > 0) {
        loto.statusHistory.forEach(action => {
          // Filter by action type if specified
          if (actionType && action.newStatus !== actionType) {
            return;
          }

          adminActions.push({
            lotoId: loto._id,
            serialNumber: loto.serialNumber,
            isolatedPart: loto.isolatedPart,
            actionType: action.newStatus,
            actionDescription: `Status changed from ${action.oldStatus} to ${action.newStatus}`,
            performedBy: action.changedByName,
            performedAt: action.changedAt,
            notes: action.notes,
            additionalData: action.additionalData,
            lotoDetails: {
              isolator: loto.isolator ? `${loto.isolator.firstName} ${loto.isolator.lastName}` : 'N/A',
              supervisor: loto.supervisor ? `${loto.supervisor.firstName} ${loto.supervisor.lastName}` : 'N/A',
              location: loto.location,
              reason: loto.reason,
              energyTypes: loto.energyTypes?.map(et => et.type).join(', ') || 'N/A'
            }
          });
        });
      }
    });

    // Sort by performed date (newest first)
    adminActions.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));

    res.json({
      success: true,
      count: adminActions.length,
      data: adminActions,
    });
  } catch (error) {
    console.error("❌ Get admin actions error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Add new handover to LOTO
// @route   POST /api/loto/:id/handover
// @access  Private
exports.addHandover = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id).populate("isolator", "firstName lastName email");

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    const { toUser, handoverNotes, handoverType } = req.body;

    // Validate required fields
    if (!toUser) {
      return res.status(400).json({
        success: false,
        message: "To User is required",
      });
    }

    // Check if toUser exists
    const toUserDoc = await User.findById(toUser);
    if (!toUserDoc) {
      return res.status(400).json({
        success: false,
        message: "Target user not found",
      });
    }

    // Determine the current responsible user
    let fromUser, fromUserName;
    if (loto.handoverHistory && loto.handoverHistory.length > 0) {
      // Get the last handover's "toUser" as the current responsible
      const lastHandover = loto.handoverHistory[loto.handoverHistory.length - 1];
      fromUser = lastHandover.toUser;
      fromUserName = lastHandover.toUserName;
      console.log("Debug - Using last handover:", { fromUser, fromUserName });
    } else {
      // If no handover history, the isolator is the current responsible
      if (!loto.isolator || !loto.isolator._id) {
        return res.status(400).json({
          success: false,
          message: "LOTO isolator information is missing",
        });
      }
      
      fromUser = loto.isolator._id;
      fromUserName = `${loto.isolator.firstName || 'Unknown'} ${loto.isolator.lastName || 'User'}`;
      console.log("Debug - Using isolator:", { 
        fromUser, 
        fromUserName, 
        isolator: loto.isolator,
        firstName: loto.isolator.firstName,
        lastName: loto.isolator.lastName
      });
    }

    // Validate fromUserName is not undefined
    if (!fromUserName || fromUserName.includes('undefined')) {
      console.error("Debug - Invalid fromUserName:", fromUserName);
      return res.status(500).json({
        success: false,
        message: "Unable to determine current responsible user name",
        error: `Invalid fromUserName: ${fromUserName}`,
      });
    }

    // Validate that the handover is initiated by the current responsible user
    if (fromUser.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the current responsible user or admin can initiate handovers",
      });
    }

    // Prevent self-handover
    if (fromUser.toString() === toUser) {
      return res.status(400).json({
        success: false,
        message: "Cannot handover to yourself",
      });
    }

    // Ensure we have the creator's name
    console.log("Debug - req.user:", {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      username: req.user.username
    });
    
    let creatorName;
    if (req.user.firstName && req.user.lastName) {
      creatorName = `${req.user.firstName} ${req.user.lastName}`;
    } else {
      // Fetch user details from database if not available in req.user
      try {
        const userDoc = await User.findById(req.user.id);
        if (userDoc) {
          creatorName = `${userDoc.firstName} ${userDoc.lastName}`;
        } else {
          creatorName = req.user.email || req.user.username || 'Unknown User';
        }
      } catch (userError) {
        console.error("Debug - Error fetching user:", userError);
        creatorName = req.user.email || req.user.username || 'Unknown User';
      }
    }

    console.log("Debug - Final creatorName:", creatorName);

    // Validate required fields
    if (!req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from request",
      });
    }

    if (!creatorName || creatorName === 'Unknown User') {
      return res.status(400).json({
        success: false,
        message: "Unable to determine creator name",
      });
    }

    // Assign a verifier for the handover
    let assignedVerifier = null;
    let assignedVerifierName = null;
    
    try {
      // Find a supervisor or admin to assign as verifier
      const User = require("../models/User");
      const verifier = await User.findOne({
        role: { $in: ["supervisor", "admin"] }
      }).select("_id firstName lastName");
      
      if (verifier) {
        assignedVerifier = verifier._id;
        assignedVerifierName = `${verifier.firstName} ${verifier.lastName}`;
        console.log("Debug - Assigned verifier:", assignedVerifierName);
      } else {
        console.log("Debug - No supervisor/admin found to assign as verifier");
      }
    } catch (verifierError) {
      console.error("Debug - Error finding verifier:", verifierError);
    }

    // Create new handover record
    const newHandover = {
      fromUser: fromUser,
      fromUserName: fromUserName,
      toUser: toUser,
      toUserName: `${toUserDoc.firstName} ${toUserDoc.lastName}`,
      handoverNotes: handoverNotes || "",
      handoverType: handoverType || "other",
      createdBy: req.user.id,
      createdByName: creatorName,
      handoverDate: Date.now(),
      status: "pending",
      recipientStatus: "pending", // Recipient needs to decide
      verificationStatus: "pending", // Will be verified after recipient accepts
      assignedVerifier: assignedVerifier,
      assignedVerifierName: assignedVerifierName,
    };

    console.log("Debug - newHandover:", newHandover);

    // Validate the newHandover object before adding to history
    console.log("Debug - createdBy type:", typeof newHandover.createdBy, "value:", newHandover.createdBy);
    console.log("Debug - createdByName type:", typeof newHandover.createdByName, "value:", newHandover.createdByName);
    
    if (!newHandover.createdBy || !newHandover.createdByName) {
      console.error("Debug - Invalid newHandover object:", newHandover);
      return res.status(500).json({
        success: false,
        message: "Invalid handover data",
        error: "Missing required fields: createdBy or createdByName",
        debug: newHandover
      });
    }

    // Add to handover history
    if (!loto.handoverHistory) {
      loto.handoverHistory = [];
    }
    console.log("Debug - Existing handoverHistory length:", loto.handoverHistory.length);
    console.log("Debug - Existing handoverHistory:", loto.handoverHistory);
    loto.handoverHistory.push(newHandover);

    // Update current responsible
    loto.currentResponsible = toUser;
    loto.currentResponsibleName = `${toUserDoc.firstName} ${toUserDoc.lastName}`;
    loto.handoverTo = toUser;
    loto.handoverNotes = handoverNotes || "";

        // Update status to pending_handover_verification when handover is created
        if (loto.status === "active") {
          loto.status = "pending_handover_verification";
        }

    loto.updatedAt = Date.now();
    
    console.log("Debug - LOTO handoverHistory before save:", loto.handoverHistory);
    console.log("Debug - First handover in history:", loto.handoverHistory[0]);
    
    try {
      await loto.save();
      console.log("Debug - LOTO saved successfully");
    } catch (saveError) {
      console.error("Debug - Save error:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save handover",
        error: saveError.message,
        details: saveError.errors
      });
    }

    // Create handover notification (same as handoverLOTO function)
    try {
      const HandoverNotification = require("../models/HandoverNotification");
      const notification = await HandoverNotification.create({
        lotoId: loto._id,
        fromUser: fromUser,
        toUser: toUser,
        lotoDetails: {
          isolatedPart: loto.isolatedPart,
          reason: loto.reason,
          shift: loto.shift,
          line: loto.line,
        },
        handoverNotes: handoverNotes,
      });
      
      // Update the handover history entry with notification ID
      const lastHistoryEntry = loto.handoverHistory[loto.handoverHistory.length - 1];
      lastHistoryEntry.notificationId = notification._id;
      await loto.save();
      
      console.log("✅ Handover notification created successfully:", notification._id);
      console.log("✅ Handover history updated with notification ID");
    } catch (notificationError) {
      console.error("❌ Failed to create handover notification:", notificationError);
      // Don't fail the entire handover process, but log the error for debugging
      console.error("Notification creation error details:", {
        lotoId: loto._id,
        fromUser: fromUser,
        toUser: toUser,
        error: notificationError.message,
        stack: notificationError.stack
      });
    }

    // Populate the updated LOTO
    const updatedLOTO = await LOTO.findById(req.params.id)
      .populate("isolator", "firstName lastName email")
      .populate("supervisor", "firstName lastName email")
      .populate("handoverTo", "firstName lastName email")
      .populate("currentResponsible", "firstName lastName email")
      .populate("verifiedBy", "firstName lastName email")
      .populate("rejectedBy", "firstName lastName email")
      .populate("handoverHistory.fromUser", "firstName lastName email")
      .populate("handoverHistory.toUser", "firstName lastName email")
      .populate("handoverHistory.createdBy", "firstName lastName email");

    res.json({
      success: true,
      message: `Handover from ${fromUserName} to ${toUserDoc.firstName} ${toUserDoc.lastName} created successfully`,
      data: updatedLOTO,
    });
  } catch (error) {
    console.error("❌ Add handover error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get handover history for a LOTO
// @route   GET /api/loto/:id/handover-history
// @access  Private
exports.getHandoverHistory = async (req, res) => {
  try {
    const loto = await LOTO.findById(req.params.id)
      .populate("handoverHistory.fromUser", "firstName lastName email")
      .populate("handoverHistory.toUser", "firstName lastName email")
      .populate("handoverHistory.createdBy", "firstName lastName email")
      .populate("isolator", "firstName lastName email")
      .populate("currentResponsible", "firstName lastName email");

    if (!loto) {
      return res.status(404).json({
        success: false,
        message: "LOTO not found",
      });
    }

    // Build handover chain
    const handoverChain = [];
    if (loto.handoverHistory && loto.handoverHistory.length > 0) {
      // Start with isolator
      handoverChain.push(`${loto.isolator.firstName} ${loto.isolator.lastName}`);
      
      // Add each handover
      loto.handoverHistory.forEach(handover => {
        handoverChain.push(`${handover.toUser.firstName} ${handover.toUser.lastName}`);
      });
    } else {
      // No handovers, just isolator
      handoverChain.push(`${loto.isolator.firstName} ${loto.isolator.lastName}`);
    }

    res.json({
      success: true,
      data: {
        lotoId: loto._id,
        serialNumber: loto.serialNumber,
        isolatedPart: loto.isolatedPart,
        handoverChain: handoverChain.join(" → "),
        currentResponsible: loto.currentResponsibleName,
        handoverHistory: loto.handoverHistory || [],
        totalHandovers: loto.handoverHistory ? loto.handoverHistory.length : 0,
      },
    });
  } catch (error) {
    console.error("❌ Get handover history error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
