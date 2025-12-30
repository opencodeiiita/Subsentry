const Subscription = require("../Models/SubscriptionSchema");

const toUtcDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

const addUtcDays = (startUtc, days) => {
  const date = new Date(startUtc);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const addUtcMonths = (startUtc, months) => {
  const date = new Date(startUtc);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date;
};

const addUtcYears = (startUtc, years) => {
  const date = new Date(startUtc);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date;
};

const computeNextRenewalDate = (startUtc, billingInterval) => {
  switch (billingInterval) {
    case "daily":
      return addUtcDays(startUtc, 1);
    case "weekly":
      return addUtcDays(startUtc, 7);
    case "monthly":
      return addUtcMonths(startUtc, 1);
    case "yearly":
      return addUtcYears(startUtc, 1);
    default:
      return null;
  }
};

const computeIntervalCount = (startUtc, endUtc, billingInterval) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = endUtc.getTime() - startUtc.getTime();
  if (diffMs <= 0) return null;

  const diffDays = diffMs / msPerDay;
  if (!Number.isInteger(diffDays)) return null;

  switch (billingInterval) {
    case "daily":
      return diffDays + 1;
    case "weekly":
      return diffDays % 7 === 0 ? diffDays / 7 + 1 : null;
    case "monthly": {
      if (startUtc.getUTCDate() !== endUtc.getUTCDate()) return null;
      const months =
        (endUtc.getUTCFullYear() - startUtc.getUTCFullYear()) * 12 +
        (endUtc.getUTCMonth() - startUtc.getUTCMonth());
      return months > 0 ? months + 1 : null;
    }
    case "yearly": {
      if (
        startUtc.getUTCMonth() !== endUtc.getUTCMonth() ||
        startUtc.getUTCDate() !== endUtc.getUTCDate()
      ) {
        return null;
      }
      const years = endUtc.getUTCFullYear() - startUtc.getUTCFullYear();
      return years > 0 ? years + 1 : null;
    }
    default:
      return null;
  }
};

const getSubscriptions = (req, res) => {
  const user = req.user;
  if (!user || !user._id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  Subscription.find({ userId: user._id })
    .then((subscriptions) => {
      res.status(200).json({ subscriptions });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    });
};
//in this function, I have made is so that the next renewal date and billing interval count are calculated based on the start and end date entered byt the user.
const addSubscription = async (req, res) => {
  const user = req.user;
  const data = req.body || {};

  if (!user || !user._id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    name,
    status,
    billingInterval,
    startDate,
    endDate,
    billingIntervalCount,
  } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }
  if (!billingInterval) {
    return res.status(400).json({ error: "billingInterval is required" });
  }
  if (!startDate) {
    return res.status(400).json({ error: "startDate is required" });
  }
  if (billingInterval !== "custom" && !endDate) {
    return res.status(400).json({ error: "endDate is required" });
  }

  const parsedStartDate = toUtcDateOnly(startDate);
  if (!parsedStartDate) {
    return res.status(400).json({ error: "startDate must be a valid date" });
  }

  let parsedEndDate = endDate ? toUtcDateOnly(endDate) : null;
  if (endDate && !parsedEndDate) {
    return res.status(400).json({ error: "endDate must be a valid date" });
  }

  let computedBillingIntervalCount;
  let computedNextRenewalDate;

  if (billingInterval === "custom") {
    const count = Number(billingIntervalCount);
    if (!Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
      return res.status(400).json({
        error:
          "billingIntervalCount must be a positive integer for custom interval",
      });
    }

    computedBillingIntervalCount = count;
    computedNextRenewalDate = addUtcDays(parsedStartDate, count);

    if (
      parsedEndDate &&
      parsedEndDate.getTime() !== computedNextRenewalDate.getTime()
    ) {
      return res.status(400).json({
        error:
          "endDate must match startDate + billingIntervalCount days for custom interval",
      });
    }

    parsedEndDate = computedNextRenewalDate;
  } else {
    const count = computeIntervalCount(
      parsedStartDate,
      parsedEndDate,
      billingInterval
    );
    if (!count) {
      return res.status(400).json({
        error:
          "Invalid date range for billingInterval (endDate must be after startDate and align with the interval).",
      });
    }
    computedBillingIntervalCount = count;

    computedNextRenewalDate = computeNextRenewalDate(
      parsedStartDate,
      billingInterval
    );
    if (!computedNextRenewalDate) {
      return res.status(400).json({ error: "Unsupported billingInterval" });
    }
    if (computedNextRenewalDate.getTime() > parsedEndDate.getTime()) {
      return res.status(400).json({
        error: "endDate must be on/after the first renewal date",
      });
    }
  }

  try {
    const created = await Subscription.create({
      userId: user._id,
      name: name.trim(),
      category: data.category,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      billingInterval: data.billingInterval,
      billingIntervalCount: computedBillingIntervalCount,
      startDate: parsedStartDate,
      nextRenewalDate: computedNextRenewalDate,
      endDate: parsedEndDate,
      autoRenew: data.autoRenew,
      trialEndDate: data.trialEndDate,
      source: data.source,
      sourceReferenceId: data.sourceReferenceId,
      confidenceScore: data.confidenceScore,
      userNotes: data.userNotes,
      isArchived: data.isArchived,
    });

    return res.status(201).json({ subscription: created });
  } catch (err) {
    const isBadRequest =
      err && (err.name === "ValidationError" || err.name === "CastError");

    if (isBadRequest) {
      return res.status(400).json({
        error: "Invalid subscription data",
        details: err.message,
      });
    }

    return res
      .status(500)
      .json({ error: "Failed to add subscription", details: err.message });
  }
};

module.exports = {
  addSubscription,
  getSubscriptions,
};
