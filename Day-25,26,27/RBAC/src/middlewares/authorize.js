const permissionService = require('@services/permission.service');
const ApiError = require('@utils/ApiError');
const { ERROR_CODES } = require('@constants/messages');

/**
 * Authorizes a request against module and action permissions.
 * Super admin bypasses all checks.
 * Subadmin permissions are resolved fresh from DB on every request.
 * @param {string} moduleKey - The key of the module (e.g. 'orders')
 * @param {string|Function} action - Action string (e.g. 'view') or function (req) => action
 */
function authorize(moduleKey, action) {
  return async (req, res, next) => {
    try {
      if (!req.auth) {
        throw ApiError.unauthorized('Authentication required');
      }

      // Super admin passes every check unconditionally
      if (req.auth.actorType === 'admin') {
        return next();
      }

      const resolvedAction = typeof action === 'function' ? action(req) : action;

      const hasPerm = await permissionService.hasPermission(
        req.auth.id,
        moduleKey,
        resolvedAction
      );

      if (!hasPerm) {
        throw new ApiError(
          403,
          `Forbidden: Missing ${resolvedAction} permission for module ${moduleKey}`,
          ERROR_CODES.FORBIDDEN
        );
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = authorize;
