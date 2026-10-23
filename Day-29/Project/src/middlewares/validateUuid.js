import { BadRequestError } from './errorHandler.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates request parameter against standard UUID format
 * @param {string} paramName - Name of the route parameter (e.g. 'id', 'userId')
 */
export function validateUuidParam(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !UUID_REGEX.test(value.trim())) {
      return next(
        new BadRequestError(
          `Invalid '${paramName}' parameter format: '${value}'. Expected a valid 36-character UUID.`
        )
      );
    }

    req.params[paramName] = value.trim();
    next();
  };
}
