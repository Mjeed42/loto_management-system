const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 0,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    sessionStartedAt: {
      type: Date,
      default: Date.now,
    },
    isRememberMe: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

refreshTokenSchema.methods.isIdleTimeout = function () {
  const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
  const timeSinceLastActivity = Date.now() - this.lastActivityAt.getTime();
  return timeSinceLastActivity > IDLE_TIMEOUT_MS;
};

refreshTokenSchema.methods.isAbsoluteTimeout = function () {
  const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000;
  const timeSinceSessionStart = Date.now() - this.sessionStartedAt.getTime();
  return timeSinceSessionStart > ABSOLUTE_TIMEOUT_MS;
};

refreshTokenSchema.methods.updateActivity = async function () {
  this.lastActivityAt = new Date();
  await this.save();
};

refreshTokenSchema.statics.cleanupExpired = async function () {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

refreshTokenSchema.statics.revokeAllForUser = async function (userId) {
  return this.deleteMany({ userId });
};

module.exports = mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
