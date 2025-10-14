const mongoose = require("mongoose");

const lotoSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      unique: true,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    customCreatedAt: {
      type: Boolean,
      default: false,
      // Flag to indicate if the creation time was manually set by user
    },
    shift: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      // No enum validation - locations are now dynamic from Location collection
    },
    line: String,
    machine: String,
    isolator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isolatorName: {
      type: String,
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supervisorName: {
      type: String,
    },
    isolatedPart: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    ptwNumber: {
      type: String,
      default: "N/A",
    },
    expectedDuration: {
      type: Number, // in hours
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: {
      type: Date,
    },
    rejectionNotes: {
      type: String,
    },
    rejectedFields: [{
      type: String,
      enum: [
        "shift",
        "location", 
        "line",
        "machine",
        "isolatedPart",
        "reason",
        "ptwNumber",
        "expectedDuration",
        "supervisor",
        "energyTypes"
      ]
    }],
    rejectionHistory: [
      {
        rejectedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rejectedByName: {
          type: String,
          required: true,
        },
        rejectionNotes: {
          type: String,
          required: true,
        },
        rejectedFields: [{
          type: String,
          enum: [
            "shift",
            "location", 
            "line",
            "machine",
            "isolatedPart",
            "reason",
            "ptwNumber",
            "expectedDuration",
            "supervisor",
            "energyTypes"
          ]
        }],
        rejectedAt: {
          type: Date,
          default: Date.now,
        },
        resolvedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: [
        "pending_verification_new",      // New LOTO awaiting initial verification
        "active",                        // LOTO is active and operational
        "pending_handover_verification", // LOTO under handover verification
        "handed_over",                   // LOTO successfully handed over
        "completed",                     // LOTO work completed
        "rejected",                      // LOTO rejected by supervisor
        "rejected_handover_snapshot",    // Read-only snapshot of rejected handover
        "handed_over_snapshot",          // Read-only snapshot for sender after successful handover
      ],
      default: "pending_verification_new",
    },
    // Snapshot fields - for rejected handover copies
    isSnapshot: {
      type: Boolean,
      default: false,
    },
    originalLotoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LOTO",
    },
    snapshotReason: {
      type: String,
      enum: [
        "handover_rejected_by_recipient",
        "handover_rejected_by_supervisor",
        "handover_completed_sender_copy"  // Sender's copy after successful handover
      ],
    },
    snapshotCreatedAt: {
      type: Date,
    },
    snapshotCreatedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    snapshotCreatedForName: {
      type: String,
    },
    actualFinishTime: {
      type: Date,
    },
    actualFinishDate: {
      type: Date,
    },
    handoverTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    handoverNotes: {
      type: String,
    },
    handoverHistory: [
      {
        fromUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        fromUserName: {
          type: String,
          required: true,
        },
        toUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        toUserName: {
          type: String,
          required: true,
        },
        handoverNotes: {
          type: String,
          default: "",
        },
        handoverType: {
          type: String,
          enum: ["shift_change", "break_coverage", "maintenance_handover", "emergency", "other"],
          default: "other",
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdByName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        // Recipient decision fields
        recipientStatus: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        recipientDecisionDate: Date,
        recipientDecisionNotes: {
          type: String,
        },
        handoverDate: {
          type: Date,
          default: Date.now,
        },
        responseDate: Date,
        notificationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "HandoverNotification",
        },
        // Verification fields
        verificationStatus: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        verifiedByName: {
          type: String,
        },
        verificationDate: Date,
        verificationNotes: {
          type: String,
        },
        rejectionReason: {
          type: String,
        },
        // Assigned verifier for pending handovers
        assignedVerifier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        assignedVerifierName: {
          type: String,
        },
      },
    ],
    // Current responsible person (last "toUser" in handoverHistory)
    currentResponsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currentResponsibleName: {
      type: String,
    },
    completionNotes: {
      type: String,
    },
    energyTypes: [
      {
        type: {
          type: String,
          required: true,
          // No enum - energy types are dynamic from EnergyType collection
        },
        isolationPoint: {
          type: String,
          required: false, // Isolation point is optional
          default: "",
        },
      },
    ],
    statusHistory: [
      {
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        changedByName: {
          type: String,
          required: true,
        },
        oldStatus: {
          type: String,
          required: true,
        },
        newStatus: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
        },
        additionalData: {
          type: mongoose.Schema.Types.Mixed,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Additional fields for status-specific data
    assignedTechnician: {
      type: String,
    },
    workStartTime: {
      type: Date,
    },
    estimatedCompletion: {
      type: Date,
    },
    completionTime: {
      type: Date,
    },
    completedBy: {
      type: String,
    },
    completedByName: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
    workSummary: {
      type: String,
    },
    handoverReason: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
lotoSchema.index({ serialNumber: 1 });
lotoSchema.index({ status: 1 });
lotoSchema.index({ isolator: 1 });
lotoSchema.index({ supervisor: 1 }); // NEW INDEX
lotoSchema.index({ handoverTo: 1 });
lotoSchema.index({ location: 1 });

module.exports = mongoose.models.LOTO || mongoose.model("LOTO", lotoSchema);
