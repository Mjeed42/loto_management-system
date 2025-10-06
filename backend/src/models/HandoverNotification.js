const mongoose = require("mongoose");

const handoverNotificationSchema = new mongoose.Schema({
  lotoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LOTO",
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lotoDetails: {
    isolatedPart: String,
    reason: String,
    shift: String,
    line: String,
  },
  handoverNotes: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
  readAt: Date,
});

module.exports = mongoose.model(
  "HandoverNotification",
  handoverNotificationSchema
);
