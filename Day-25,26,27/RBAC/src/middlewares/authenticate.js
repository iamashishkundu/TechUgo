const { models } = require('@db');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const { User, Admin } = models;

/**
 * Authenticates requests and verifies actor type, account status, and session validity.
 * @param {string[]} allowedActorTypes - Array of allowed actor types (e.g. ['user'], ['admin'], ['admin', 'subadmin'])
 */
function authenticate(allowedActorTypes = []) {
  const allowed = Array.isArray(allowedActorTypes) ? allowedActorTypes : (allowedActorTypes ? [allowedActorTypes] : []);
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Access token required');
      }

      const token = authHeader.split(' ')[1];
      const decoded = tokenService.verifyAccessToken(token);

      // Check allowed actor types
      if (allowed.length > 0 && !allowed.includes(decoded.actorType)) {
        throw ApiError.forbidden(MESSAGES.FORBIDDEN);
      }

      // Check that the session family is still active
      const isSessionValid = await sessionService.isSessionActive(decoded.sid);
      if (!isSessionValid) {
        throw ApiError.unauthorized('Session has expired or been revoked');
      }

      let actor = null;
      let adminType = null;

      if (decoded.actorType === 'user') {
        actor = await User.findByPk(decoded.sub);
        if (!actor) {
          throw ApiError.unauthorized('User not found');
        }
        if (actor.status === 'blocked') {
          throw new ApiError(403, MESSAGES.ACCOUNT_BLOCKED, ERROR_CODES.ACCOUNT_BLOCKED);
        }
      } else if (decoded.actorType === 'admin' || decoded.actorType === 'subadmin') {
        actor = await Admin.findByPk(decoded.sub);
        if (!actor) {
          throw ApiError.unauthorized('Staff member not found');
        }
        if (actor.status === 'blocked') {
          throw new ApiError(403, MESSAGES.ACCOUNT_BLOCKED, ERROR_CODES.ACCOUNT_BLOCKED);
        }

        // Validate admin type vs decoded actor type
        if (decoded.actorType === 'admin' && actor.type !== 'super_admin') {
          throw ApiError.forbidden(MESSAGES.FORBIDDEN);
        }
        if (decoded.actorType === 'subadmin' && actor.type !== 'subadmin') {
          throw ApiError.forbidden(MESSAGES.FORBIDDEN);
        }

        adminType = actor.type;
      } else {
        throw ApiError.forbidden('Invalid actor type in token');
      }

      req.auth = {
        id: actor.id,
        actorType: decoded.actorType,
        adminType,
        sessionId: decoded.sid
      };
      req.actor = actor;

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = {
  authenticate
};
