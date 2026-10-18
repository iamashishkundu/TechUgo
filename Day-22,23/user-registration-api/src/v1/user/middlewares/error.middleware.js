const { ZodError } = require('zod');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Runs when no route matched. Just creates an error and hands it on.
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Express recognizes an error handler by its 4 parameters, so keep `next` even if unused
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = 500;
  let message = 'Internal server error';
  let details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
  } else if (err instanceof jwt.TokenExpiredError) {
    // Must come before JsonWebTokenError: expired is a subclass of it
    statusCode = 401;
    message = 'Token expired';
  } else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.NotBeforeError) {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Email already in use'; // email is our only UNIQUE column
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body too large';
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details ?? undefined;
  } else {
    console.error(err); // log the real error server-side only
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

module.exports = { notFound, errorHandler };
