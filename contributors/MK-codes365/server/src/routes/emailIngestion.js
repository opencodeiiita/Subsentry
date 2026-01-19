const express = require("express");
const router = express.Router();
const { extractAmount, extractBillingHint, extractServiceName } = require("../utils/parser");

const MOCK_EMAILS = [
  {
    subject: "Your Netflix subscription receipt",
    snippet: "Monthly Premium plan: $15.99. Thanks for joining!",
    date: new Date().toISOString()
  },
  {
    subject: "Spotify Premium - Monthly Renewal",
    snippet: "We've successfully processed your payment of 10.99 USD.",
    date: new Date().toISOString()
  },
  {
    subject: "Adobe Creative Cloud: Payment Confirmation",
    snippet: "Your annual plan was renewed for $52.99.",
    date: new Date().toISOString()
  }
];

router.post("/scan", async (req, res) => {
  try {
    await new Promise(r => setTimeout(r, 1500));

    const results = MOCK_EMAILS.map(email => ({
      service: extractServiceName(email.subject, email.snippet),
      amount: extractAmount(email.snippet) || extractAmount(email.subject),
      billing: extractBillingHint(email.subject + " " + email.snippet),
      date: email.date
    }));

    res.json({
      success: true,
      found: results.length,
      subscriptions: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during email scan"
    });
  }
});

module.exports = router;
