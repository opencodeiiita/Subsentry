import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Other",
    },

    status: {
      type: String,
      enum: ["trial", "active", "paused", "cancelled", "expired"],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    billingInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "custom"],
      required: true,
      index: true,
    },

    billingIntervalCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    nextRenewalDate: Date,

    endDate: Date,

    autoRenew: {
      type: Boolean,
      default: false,
    },

    trialEndDate: Date,

    source: {
      type: String,
      enum: ["manual", "gmail", "other"],
      default: "manual",
    },

    sourceReferenceId: {
      type: String,
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 1,
    },

    lastChargedAt: Date,

    userNotes: {
      type: String,
      maxlength: 500,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index(
  { userId: 1, name: 1, sourceReferenceId: 1 },
  { sparse: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
