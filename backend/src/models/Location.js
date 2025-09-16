const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["location", "line", "machine", "other"],
      default: "location",
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

// Add indexes
locationSchema.index({ name: 1 });
locationSchema.index({ parent: 1 });
locationSchema.index({ type: 1 });

module.exports =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
