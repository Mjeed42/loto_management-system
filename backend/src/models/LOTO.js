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
    isolator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isolatorName: {
      type: String,
      required: true,
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
    actualStartTime: {
      type: Date,
      default: Date.now,
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
      enum: ["pending", "active", "completed", "pending_handover", "handover"],
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
  },
  {
    timestamps: true,
  }
);

// Create index for serialNumber
lotoSchema.index({ serialNumber: 1 });

module.exports = mongoose.model("LOTO", lotoSchema);
