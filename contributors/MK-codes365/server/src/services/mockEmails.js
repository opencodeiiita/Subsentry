/**
 * Mock email data for testing subscription parsing.
 * Various formats and edge cases to ensure robust parsing.
 */
const mockEmails = [
  {
    subject: "Your Netflix subscription receipt",
    snippet: "Thanks for joining Netflix. You've been charged $15.99 for your Monthly Premium plan renewal.",
    date: "2026-01-15T10:00:00Z"
  },
  {
    subject: "Spotify Premium - Payment Receipt",
    snippet: "Next billing date: Feb 20, 2026. Your Spotify Premium Individual monthly subscription has been renewed for USD 10.99.",
    date: "2026-01-20T08:30:00Z"
  },
  {
    subject: "Your Adobe Creative Cloud renewal",
    snippet: "This is to confirm your annual subscription for Adobe Creative Cloud has been renewed. Amount: $52.99.",
    date: "2026-01-10T14:15:00Z"
  },
  {
    subject: "YouTube Premium subscription",
    snippet: "Your monthly YouTube Premium plan was charged. Total: 129.00 INR.",
    date: "2026-01-18T12:00:00Z"
  },
  {
    subject: "Disney+ Subscription Confirmation",
    snippet: "We're excited to have you back! Your Disney+ Account has been successfully charged for your annual plan renewal.",
    date: "2026-01-05T09:45:00Z"
  },
  {
    subject: "Amazon Prime - Thank you for your payment",
    snippet: "Your Amazon Prime membership has been renewed. Charged $139.00 for your annual plan.",
    date: "2026-01-12T16:20:00Z"
  },
  {
    subject: "Generic Receipt #5521",
    snippet: "You have been charged $5.00 for your weekly subscription to PuzzleApp.",
    date: "2026-01-19T11:11:11Z"
  }
];

module.exports = mockEmails;
