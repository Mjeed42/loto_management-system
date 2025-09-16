const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["location", "line", "machine", "utility", "process"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
    isLeaf: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
locationSchema.index({ name: 1 });
locationSchema.index({ code: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ parent: 1 });

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
