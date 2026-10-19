const jwt = require('jsonwebtoken');
const env = require('@config/env');
const ApiError = require('@utils/ApiError');

const tokenService = {
  generateAccessToken({ id, actorType, sessionId }) {
    const payload = {
      sub: id,
      actorType,
      sid: sessionId
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_TTL
    });
  },

  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      if (decoded.purpose && decoded.purpose === '2fa') {
        throw ApiError.unauthorized('Invalid access token');
      }
      return decoded;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Access token has expired');
      }
      throw ApiError.unauthorized('Invalid access token');
    }
  },

  generateTwoFactorToken({ id, actorType }) {
    const payload = {
      sub: id,
      actorType,
      purpose: '2fa'
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.TWO_FACTOR_TOKEN_TTL
    });
  },

  verifyTwoFactorToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      if (decoded.purpose !== '2fa') {
        throw ApiError.unauthorized('Invalid two-factor authentication token');
      }
      return decoded;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Two-factor token has expired');
      }
      throw ApiError.unauthorized('Invalid two-factor authentication token');
    }
  }
};

module.exports = tokenService;
