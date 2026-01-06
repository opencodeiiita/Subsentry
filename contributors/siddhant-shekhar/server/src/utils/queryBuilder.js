import {
  PAGINATION,
  SORT_FIELDS,
  SORT_ORDER,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_CATEGORIES,
} from '../constants/subscription.constants.js';

export const parsePagination = (query) => {
  let page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const parseSort = (query) => {
  const validFields = Object.values(SORT_FIELDS);
  const sortField = validFields.includes(query.sortBy)
    ? query.sortBy
    : SORT_FIELDS.RENEWAL_DATE;

  const sortOrder = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

  return { [sortField]: sortOrder };
};

export const buildFilter = (userId, query) => {
  const filter = { userId };

  if (query.status && Object.values(SUBSCRIPTION_STATUS).includes(query.status)) {
    filter.status = query.status;
  }

  if (query.category && Object.values(SUBSCRIPTION_CATEGORIES).includes(query.category)) {
    filter.category = query.category;
  }

  if (query.isTrial !== undefined) {
    filter.isTrial = query.isTrial === 'true';
  }

  if (query.renewalFrom || query.renewalTo) {
    filter.renewalDate = {};
    if (query.renewalFrom) {
      filter.renewalDate.$gte = new Date(query.renewalFrom);
    }
    if (query.renewalTo) {
      filter.renewalDate.$lte = new Date(query.renewalTo);
    }
  }

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  return filter;
};
