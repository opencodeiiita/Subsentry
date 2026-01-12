function getMonthlySpend(subscriptions) {
  return subscriptions.reduce((total, sub) => {
    if (sub.billingCycle === "monthly") return total + sub.price;
    if (sub.billingCycle === "yearly") return total + sub.price / 12;
    return total;
  }, 0);
}

module.exports = { getMonthlySpend };
