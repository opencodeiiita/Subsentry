// server/models/subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, enum: ["monthly", "yearly"], required: true }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
