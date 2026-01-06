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
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      uppercase: true,
      maxlength: 3,
    },
    billingCycle: {
      type: String,
      enum: {
        values: Object.values(BILLING_CYCLES),
        message: '{VALUE} is not a valid billing cycle',
      },
      required: [true, 'Billing cycle is required'],
    },
    category: {
      type: String,
      enum: {
        values: Object.values(SUBSCRIPTION_CATEGORIES),
        message: '{VALUE} is not a valid category',
      },
      default: SUBSCRIPTION_CATEGORIES.OTHER,
    },
    renewalDate: {
      type: Date,
      required: [true, 'Renewal date is required'],
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
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ userId: 1, renewalDate: 1 });
subscriptionSchema.index({ userId: 1, category: 1 });

export const Subscription = model('Subscription', subscriptionSchema);
