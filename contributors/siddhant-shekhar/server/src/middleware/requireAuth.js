import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/http.constants.js';

const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
      error: {
        code: 'UNAUTHORIZED',
        details: 'Valid authentication token required',
      },
    });
  }

  return next();
};

export default requireAuth;
