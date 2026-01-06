import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/http.constants.js';
import { errorResponse } from '../utils/responseBuilder.js';

export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        message: 'Page must be a positive integer',
        code: 'INVALID_PAGE',
      })
    );
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        message: 'Limit must be between 1 and 100',
        code: 'INVALID_LIMIT',
      })
    );
  }

  next();
};

export const validateDateRange = (req, res, next) => {
  const { renewalFrom, renewalTo } = req.query;

  if (renewalFrom && isNaN(Date.parse(renewalFrom))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        message: 'Invalid renewalFrom date format',
        code: 'INVALID_DATE_FROM',
      })
    );
  }

  if (renewalTo && isNaN(Date.parse(renewalTo))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        message: 'Invalid renewalTo date format',
        code: 'INVALID_DATE_TO',
      })
    );
  }

  if (renewalFrom && renewalTo && new Date(renewalFrom) > new Date(renewalTo)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        message: 'renewalFrom cannot be after renewalTo',
        code: 'INVALID_DATE_RANGE',
      })
    );
  }

  next();
};