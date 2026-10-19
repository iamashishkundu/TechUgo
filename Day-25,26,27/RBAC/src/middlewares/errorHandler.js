const { ZodError } = require('zod');
const {
  ValidationError: SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError
} = require('sequelize');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const ApiError = require('@utils/ApiError');
const logger = require('@config/logger');
const env = require('@config/env');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error('Error occurred in request: %s %s - %s', req.method, req.originalUrl, err.message, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Handle ApiError
  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message,
      code: err.code
    };
    if (err.errors && err.errors.length > 0) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  }

  // Handle Zod Validation Error
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

  // Handle Sequelize Unique Constraint Error
  if (err instanceof UniqueConstraintError) {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'resource';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
      code: ERROR_CODES.CONFLICT
    });
  }

  // Handle Sequelize Foreign Key Constraint Error
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(409).json({
      success: false,
      message: 'Cannot perform operation due to related records constraint',
      code: ERROR_CODES.CONFLICT
    });
  }

  // Handle Sequelize General Validation Error
  if (err instanceof SequelizeValidationError) {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Database validation failed',
      code: ERROR_CODES.BAD_REQUEST,
      errors
    });
  }

  // Handle Multer Errors
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the allowed file size limit';
    }
    return res.status(400).json({
      success: false,
      message,
      code: ERROR_CODES.BAD_REQUEST
    });
  }

  // Handle JWT Errors
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
      code: ERROR_CODES.UNAUTHORIZED
    });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Access token has expired',
      code: ERROR_CODES.UNAUTHORIZED
    });
  }

  // Generic internal server error
  const statusCode = err.status || err.statusCode || 500;
  const message = env.NODE_ENV === 'production' && statusCode === 500
    ? MESSAGES.INTERNAL_SERVER_ERROR
    : err.message || MESSAGES.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message,
    code: ERROR_CODES.INTERNAL_ERROR
  });
}

module.exports = errorHandler;
