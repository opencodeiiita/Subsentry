const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    billingCycle: {
        type: String, // e.g., monthly, yearly
        required: true
    },
    nextBillingDate: {
        type: Date,
        required: true
    },
    trialStatus: {
        type: Boolean,
        default: false
    },
    source: {
        type: String, // e.g., Gmail, manual
        default: 'manual'
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
