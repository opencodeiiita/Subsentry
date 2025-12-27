const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    // Ownership
    ownerId: {
      type: String, // Clerk user ID
      required: true,
    },

    // Basic identity
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Source of subscription
    source: {
      type: String,
      enum: ["manual", "gmail", "stripe", "apple", "google_play", "other"],
      default: "manual",
    },

    // Core lifecycle
    status: {
      type: String,
      enum: ["trial", "active", "cancelled", "expired", "paused"],
      default: "active",
    },

    autoRenew: {
      type: Boolean,
      default: true,
    },

    // Time-based truth (most important part)
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    currentPeriodEnd: {
      type: Date,
      required: true,
    },

    trialEnd: {
      type: Date, // optional → if exists & > now → trial
    },

    // Billing intent (NOT billing logic)
    cycleUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },

    cycleInterval: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Display + dashboard
    amount: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      uppercase: true,
      default: "USD",
    },

    category: {
      type: String,
      trim: true,
    },

    // External reconciliation (gmail / providers)
    externalId: {
      type: String,
    },

    isDetectedFromGmail: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
    },

    // Safe extensibility
    metadata: {
      type: Object,
      default: {},
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
