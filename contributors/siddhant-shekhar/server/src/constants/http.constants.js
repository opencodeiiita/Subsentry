export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

export const ERROR_MESSAGES = Object.freeze({
  UNAUTHORIZED: 'Authentication required. Please sign in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  INVALID_QUERY: 'Invalid query parameters provided.',
});

export const SUCCESS_MESSAGES = Object.freeze({
  SUBSCRIPTIONS_FETCHED: 'Subscriptions retrieved successfully.',
  SUBSCRIPTION_CREATED: 'Subscription created successfully.',
});
