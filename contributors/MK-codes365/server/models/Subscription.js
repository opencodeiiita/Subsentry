const mongoose = require('mongoose');

// Schema for tracking individual subscriptions
const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'], 
  },
  currency: {
    type: String,
    default: 'USD', 
    enum: ['USD', 'EUR', 'GBP', 'INR'], // easy to add more later
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly', 'weekly', 'one-time'],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  renewalDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ['Entertainment', 'Software', 'Utilities', 'Other'],
    default: 'Other',
  },
  source: {
    type: String,
    default: 'Manual', // e.g. 'Credit Card', 'Bank'
  },
  active: {
    type: Boolean,
    default: true,
  },
  // We'll use this to handle trial periods if applicable
  hasTrial: {
    type: Boolean,
    default: false,
  },
  trialEndDate: {
    type: Date,
  },
  // Linking this to the Clerk User ID
  user: {
    type: String,
    required: true,
    index: true,
  }
}, {
  timestamps: true // adds createdAt, updatedAt automatically
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
