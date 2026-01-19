const express = require("express");
const router = express.Router();
const mockEmails = require("../services/mockEmails");
const { parseEmail } = require("../services/emailParser");
const subscriptionService = require("../services/subscriptionService");

// Email scanning endpoint using parser
router.post("/scan", async (req, res) => {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate random failure ONLY if explicitly needed for testing connectivity, 
    // but here we focus on parsing logic.
    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      return res.status(400).json({
        success: false,
        message: "Gmail connection timeout. Please try again later.",
      });
    }

    // Process all mock emails through our parser
    const parsedSubscriptions = mockEmails.map(email => parseEmail(email));

    // For testing/mocking, we use a placeholder user if none provided
    const userId = req.body?.userId || "user_mock_123";
    
    let savedCount = 0;
    let skippedCount = 0;

    // Save to DB with deduplication
    for (const subData of parsedSubscriptions) {
      const isDuplicate = await subscriptionService.findDuplicate(
        subData.name,
        subData.date,
        subData.amount,
        userId
      );

      if (!isDuplicate) {
        await subscriptionService.saveEmailSubscription(subData, userId);
        savedCount++;
      } else {
        skippedCount++;
      }
    }

    res.json({
      success: true,
      found: parsedSubscriptions.length,
      saved: savedCount,
      skipped: skippedCount,
      subscriptions: parsedSubscriptions, // Optional: return the parsed ones for immediate UI feedback
    });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during email scan",
    });
  }
});

module.exports = router;

