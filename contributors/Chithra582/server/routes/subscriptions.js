const express = require("express");
const router = express.Router();
const { getMonthlySpend } = require("../helpers/monthlyHelper");
const { calculateYearlySpend } = require("../helpers/subscriptionHelpers");

// Mock data or fetch from DB
const subscriptions = [
  { name: "Spotify", price: 119, billingCycle: "monthly" },
  { name: "Prime", price: 1499, billingCycle: "yearly" }
];

router.get("/", (req, res) => {
  const monthlySpend = getMonthlySpend(subscriptions);
  const yearlySpend = calculateYearlySpend(subscriptions);

  res.json({
    data: subscriptions,
    meta: { monthlySpend, yearlySpend }
  });
});

module.exports = router;
