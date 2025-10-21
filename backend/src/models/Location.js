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
    typeLabel: {
      type: String,
      trim: true,
      // Custom display name for this level (e.g., "Department", "Section", "Line", "Equipment")
      // If not provided, defaults to the type value
    },
    section: {
      type: String,
      trim: true,
      // Category/section for grouping similar hierarchies (e.g., "Production Lines", "Utilities", "Warehouses")
      // Only used for root locations (type === "location")
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
    serialNumber: {
      type: String,
      trim: true,
      // Serial number for machines (used for barcode scanning during verification)
      // Only required for type === "machine"
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
