const LOTO = require("../models/LOTO");
const User = require("../models/User");
const HandoverNotification = require("../models/HandoverNotification");

// Helper function to generate unique serial number
const generateSerialNumber = async () => {
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
};

// @desc    Create new LOTO
// @route   POST /api/loto
// @access  Private
exports.createLOTO = async (req, res) => {
  try {
    const {
      shift,
      location,
      line,
      machine,
      customLocation,
      isolatedPart,
      reason,
      ptwNumber,
      expectedDuration,
      supervisor,
    } = req.body;

    // Generate unique serial number
    const serialNumber = await generateSerialNumber();

    // Prepare LOTO data with simplified location structure
    const lotoData = {
      serialNumber,
      shift,
      isolator: req.user.id,
      isolatorName: `${req.user.firstName} ${req.user.lastName}`,
      isolatedPart,
      reason,
      ptwNumber: ptwNumber || "N/A",
      expectedDuration: parseFloat(expectedDuration),
      status: "pending",
      location: location || "Processing", // Default location
      line: line || "",
      machine: machine || "",
      customLocation: customLocation || "",
    };

    // Add supervisor if provided
    if (supervisor) {
      // Validate that the supervisor exists and has the correct role
      const supervisorUser = await User.findById(supervisor);
      if (
        supervisorUser &&
        (supervisorUser.role === "supervisor" ||
          supervisorUser.role === "admin")
      ) {
        lotoData.supervisor = supervisor;
        lotoData.supervisorName = `${supervisorUser.firstName} ${supervisorUser.lastName}`;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid supervisor - must be a supervisor or admin",
        });
      }
    }

    const loto = await LOTO.create(lotoData);

    // Populate the created LOTO
    const populatedLOTO = await LOTO.findById(loto._id)
      .populate("isolator", "firstName lastName username")
      .populate("verifiedBy", "firstName lastName username")
      .populate("handoverTo", "firstName lastName username")
      .populate("supervisor", "firstName lastName username");

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

    // Update LOTO
    loto.status = "active";
    loto.verifiedBy = req.user.id;
    loto.verifiedAt = Date.now();

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

    // Only the isolator or handover recipient can update
    if (
      loto.isolator.toString() !== req.user.id &&
      loto.handoverTo?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this LOTO",
      });
    }

    // Only allow updates to certain fields
    const {
      expectedDuration,
      reason,
      ptwNumber,
      supervisor, // NEW FIELD - Allow supervisor updates
      isolatedPart, // NEW FIELD - Allow isolated part updates
    } = req.body;

    // Update fields if provided
    if (expectedDuration !== undefined)
      loto.expectedDuration = parseFloat(expectedDuration);
    if (reason) loto.reason = reason;
    if (ptwNumber !== undefined) loto.ptwNumber = ptwNumber;
    if (isolatedPart) loto.isolatedPart = isolatedPart; // NEW FIELD

    // NEW: Handle supervisor assignment updates
    if (supervisor !== undefined) {
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
    if (loto.isolator.toString() !== req.user.id) {
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

    await loto.save();
    console.log("LOTO updated for handover");

    // Try to create handover notification (if HandoverNotification model exists)
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
      console.log("Handover notification created:", notification._id);
    } catch (notificationError) {
      console.log(
        "Could not create handover notification (model may not exist yet):",
        notificationError.message
      );
      // Continue without notification if model doesn't exist yet
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
    loto.status = "pending"; // Changed from 'active' to 'pending'
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
