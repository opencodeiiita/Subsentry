function getYearlyAmount(subscription) {
  if (subscription.billingCycle === "monthly") return subscription.price * 12;
  if (subscription.billingCycle === "yearly") return subscription.price;
  return 0;
}

function calculateYearlySpend(subscriptions) {
  return subscriptions.reduce((total, sub) => total + getYearlyAmount(sub), 0);
}

module.exports = { getYearlyAmount, calculateYearlySpend };
