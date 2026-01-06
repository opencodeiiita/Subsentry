import { Subscription } from '../models/Subscription.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/http.constants.js';
import { SUBSCRIPTION_STATUS } from '../constants/subscription.constants.js';
import { parsePagination, parseSort, buildFilter } from '../utils/queryBuilder.js';
import { successResponse, errorResponse, buildPaginationMeta } from '../utils/responseBuilder.js';

export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
        })
      );
    }

    const { page, limit, skip } = parsePagination(req.query);
    const sort = parseSort(req.query);
    const filter = buildFilter(userId, req.query);
    const includeSummary = req.query.includeSummary === 'true';

    const [subscriptions, total, summary] = await Promise.all([
      Subscription.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Subscription.countDocuments(filter),

      includeSummary ? calculateSummary(userId) : null,
    ]);

    const responseData = { subscriptions };

    if (summary) {
      responseData.summary = summary;
    }

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: SUCCESS_MESSAGES.SUBSCRIPTIONS_FETCHED,
        data: responseData,
        meta: {
          ...buildPaginationMeta({ page, limit, total }),
          filters: {
            status: req.query.status || null,
            category: req.query.category || null,
            search: req.query.search || null,
          },
        },
      })
    );
  } catch (error) {
    console.error('Error fetching subscriptions:', error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        code: 'FETCH_FAILED',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    );
  }
};

async function calculateSummary(userId) {
  const [stats] = await Subscription.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalSubscriptions: { $sum: 1 },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$status', SUBSCRIPTION_STATUS.ACTIVE] }, 1, 0] },
        },
        pausedCount: {
          $sum: { $cond: [{ $eq: ['$status', SUBSCRIPTION_STATUS.PAUSED] }, 1, 0] },
        },
        cancelledCount: {
          $sum: { $cond: [{ $eq: ['$status', SUBSCRIPTION_STATUS.CANCELLED] }, 1, 0] },
        },
        trialCount: {
          $sum: { $cond: ['$isTrial', 1, 0] },
        },
        totalMonthlySpend: {
          $sum: {
            $switch: {
              branches: [
                { case: { $eq: ['$billingCycle', 'monthly'] }, then: '$amount' },
                { case: { $eq: ['$billingCycle', 'yearly'] }, then: { $divide: ['$amount', 12] } },
                { case: { $eq: ['$billingCycle', 'weekly'] }, then: { $multiply: ['$amount', 4.33] } },
              ],
              default: '$amount',
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalSubscriptions: 1,
        activeCount: 1,
        pausedCount: 1,
        cancelledCount: 1,
        trialCount: 1,
        totalMonthlySpend: { $round: ['$totalMonthlySpend', 2] },
        totalYearlySpend: { $round: [{ $multiply: ['$totalMonthlySpend', 12] }, 2] },
      },
    },
  ]);

  return stats || {
    totalSubscriptions: 0,
    activeCount: 0,
    pausedCount: 0,
    cancelledCount: 0,
    trialCount: 0,
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
  };
}

export const getSubscriptionById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
        })
      );
    }

    const subscription = await Subscription.findOne({ _id: id, userId }).lean();

    if (!subscription) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse({
          message: 'Subscription not found',
          code: 'NOT_FOUND',
        })
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      successResponse({
        message: 'Subscription retrieved successfully',
        data: { subscription },
      })
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        code: 'FETCH_FAILED',
      })
    );
  }
};
