const rateLimit = require('express-rate-limit');
const { ERROR_CODES } = require('@constants/messages');

const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again after a minute',
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED
    });
  }
});

module.exports = {
  globalLimiter,
  authLimiter
};
