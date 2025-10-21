const mongoose = require("mongoose");

const energyTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Energy type name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Energy type name cannot exceed 100 characters"],
    },
    symbol: {
      type: String,
      required: [true, "Energy type symbol is required"],
      trim: true,
      maxlength: [10, "Symbol cannot exceed 10 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["electrical", "mechanical", "thermal", "chemical", "hydraulic", "pneumatic", "other"],
      default: "other",
    },
    hazardLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
energyTypeSchema.index({ name: 1 });
energyTypeSchema.index({ category: 1 });
energyTypeSchema.index({ isActive: 1 });

module.exports = mongoose.model("EnergyType", energyTypeSchema);













