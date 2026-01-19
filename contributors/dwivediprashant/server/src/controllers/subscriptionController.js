const Subscription = require("../models/subscription");
///////////-1)--create subscription---///////////

const createSubscription = async (req, res) => {
  try {
    const {
      name,
      amount,
      billingCycle,
      renewalDate,
      isTrial,
      source,
      category,
      notes,
    } = req.body;
    // const userId = generateUserId();
    if (!name || !amount || !billingCycle || !renewalDate || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, amount, billingCycle, renewalDate, category",
      });
    }

    const subscription = new Subscription({
      name,
      amount,
      billingCycle,
      renewalDate: new Date(renewalDate),
      isTrial: isTrial || false,
      source: source || "manual",
      category,
      notes: notes || "",
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

///////////-2)--fetch subscription from database---///////////

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
      count: subscriptions.length,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

///////////-3)--update subscription---///////////

const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      amount,
      billingCycle,
      renewalDate,
      isTrial,
      source,
      category,
      notes,
    } = req.body;

    if (!name || !amount || !billingCycle || !renewalDate || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, amount, billingCycle, renewalDate, category",
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        name,
        amount,
        billingCycle,
        renewalDate: new Date(renewalDate),
        isTrial: isTrial || false,
        source: source || "manual",
        category,
        notes: notes || "",
      },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

///////////-4)--delete subscription---///////////

const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
};
