const { ZodError } = require('zod');
const { ERROR_CODES } = require('@constants/messages');

/**
 * Validates request body, params, and/or query using Zod schemas.
 * @param {Object} schema - Object with optional { body, params, query } Zod schemas
 */
function validate(schema = {}) {
  return async (req, res, next) => {
    try {
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));

        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          code: ERROR_CODES.VALIDATION_ERROR,
          errors
        });
      }
      return next(err);
    }
  };
}

module.exports = validate;
