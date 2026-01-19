const Subscription = require('../models/Subscription');

/**
 * Check if a subscription already exists based on name, date, and amount.
 * Uses case-insensitive name matching and same-day date comparison.
 */
async function findDuplicate(name, renewalDate, amount, userId) {
  const targetDate = new Date(renewalDate);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const duplicate = await Subscription.findOne({
    user: userId,
    name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') },
    renewalDate: { $gte: startOfDay, $lte: endOfDay },
    price: amount
  });

  return duplicate;
}

/**
 * Save a subscription from email with source="email".
 * Returns the saved subscription document.
 */
async function saveEmailSubscription(data, userId) {
  const subscription = new Subscription({
    user: userId,
    name: data.name,
    price: data.amount,
    renewalDate: data.date,
    source: 'email'
  });

  await subscription.save();
  return subscription;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  findDuplicate,
  saveEmailSubscription
};
