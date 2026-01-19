import { Schema, model } from 'mongoose';
import {
  BILLING_CYCLES,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_SOURCES,
  SUBSCRIPTION_STATUS,
  DEFAULT_CURRENCY,
} from '../constants/subscription.constants.js';

const subscriptionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      uppercase: true,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BILLING_CYCLES),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(SUBSCRIPTION_CATEGORIES),
      default: SUBSCRIPTION_CATEGORIES.OTHER,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    isTrial: {
      type: Boolean,
      default: false,
    },
    trialEndsAt: {
      type: Date,
    },
    source: {
      type: String,
      enum: Object.values(SUBSCRIPTION_SOURCES),
      default: SUBSCRIPTION_SOURCES.MANUAL,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export const Subscription = model('Subscription', subscriptionSchema);