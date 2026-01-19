const express = require("express");
const router = express.Router();
const { extractAmount, extractBilling, extractName } = require("../utils/parser");

// Mock emails with sample data
const MOCK_EMAILS = [
  {
    subject: "Your Netflix subscription receipt",
    snippet: "Monthly Premium plan: $15.99. Thanks for watching!",
    date: new Date().toISOString()
  },
  {
    subject: "Spotify Premium - Renewal Confirmation",
    snippet: "Your monthly subscription has been renewed for 10.99 USD.",
    date: new Date().toISOString()
  },
  {
    subject: "Adobe Creative Cloud Payment",
    snippet: "Success! We've charged $52.99 for your annual subscription.",
    date: new Date().toISOString()
  }
];

// Email scanning endpoint
router.post("/scan", async (req, res) => {
  try {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));

    const parsedData = MOCK_EMAILS.map(email => ({
      name: extractName(email.subject, email.snippet),
      amount: extractAmount(email.snippet) || extractAmount(email.subject),
      billing: extractBilling(email.subject + " " + email.snippet),
      date: email.date
    }));

    res.json({
      success: true,
      found: parsedData.length,
      subscriptions: parsedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during scan",
    });
  }
});

module.exports = router;

