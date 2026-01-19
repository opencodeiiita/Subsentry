import { Subscription } from '../models/Subscription.js';
import { validateCreateSubscription } from '../validators/subscription.validator.js';

export const createSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const error = validateCreateSubscription(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const subscription = new Subscription({
      ...req.body,
      userId,
    });

    const savedSubscription = await subscription.save();

    return res.status(201).json({
      message: 'Subscription created successfully',
      subscription: savedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create subscription',
      error: error.message,
    });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const subscriptions = await Subscription.find({ userId })
      .sort({ renewalDate: 1 })
      .select('-__v');

    return res.status(200).json({ subscriptions });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch subscriptions',
      error: error.message,
    });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the subscription and verify ownership
    const subscription = await Subscription.findOne({ _id: id, userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Update fields
    const allowedUpdates = [
      'name', 'amount', 'currency', 'billingCycle', 'category',
      'renewalDate', 'isTrial', 'trialEndsAt', 'source', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        subscription[field] = req.body[field];
      }
    });

    const updatedSubscription = await subscription.save();

    return res.status(200).json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update subscription',
      error: error.message,
    });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find and delete the subscription, verifying ownership
    const subscription = await Subscription.findOneAndDelete({ _id: id, userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json({
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete subscription',
      error: error.message,
    });
  }
};