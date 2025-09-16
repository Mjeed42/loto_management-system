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
    shift: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D", "E"],
    },
    // SIMPLIFIED LOCATION FIELDS
    location: {
      type: String,
      required: true,
      enum: [
        "Processing",
        "WH-FG",
        "WH-RM",
        "Project",
        "Other",
        "PKG",
        "Utility",
      ], // Add all valid locations
      trim: true,
    },
    line: {
      type: String,
      required: false,
    },
    machine: {
      type: String,
      required: false,
    },
    customLocation: {
      type: String,
      required: false,
    },
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
    status: {
      type: String,
      enum: ["pending", "active", "completed", "pending_handover"],
      default: "pending",
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
    completionNotes: {
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
lotoSchema.index({ supervisor: 1 });
lotoSchema.index({ handoverTo: 1 });
lotoSchema.index({ location: 1 });
lotoSchema.index({ line: 1 });
lotoSchema.index({ machine: 1 });

module.exports = mongoose.models.LOTO || mongoose.model("LOTO", lotoSchema);
