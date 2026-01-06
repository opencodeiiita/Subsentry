export const BILLING_CYCLES = Object.freeze({
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
});

export const SUBSCRIPTION_STATUS = Object.freeze({
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
});

export const SUBSCRIPTION_SOURCES = Object.freeze({
  MANUAL: 'manual',
  GMAIL: 'gmail',
  IMPORTED: 'imported',
});

export const SUBSCRIPTION_CATEGORIES = Object.freeze({
  ENTERTAINMENT: 'entertainment',
  MUSIC: 'music',
  EDUCATION: 'education',
  PRODUCTIVITY: 'productivity',
  FINANCE: 'finance',
  HEALTH: 'health',
  OTHER: 'other',
});

export const DEFAULT_CURRENCY = 'USD';

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});

export const SORT_FIELDS = Object.freeze({
  RENEWAL_DATE: 'renewalDate',
  AMOUNT: 'amount',
  NAME: 'name',
  CREATED_AT: 'createdAt',
  STATUS: 'status',
});

export const SORT_ORDER = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});
