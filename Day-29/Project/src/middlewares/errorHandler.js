/**
 * Custom Application Error Hierarchy
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request payload') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict detected') {
    super(message, 409, 'CONFLICT');
  }
}

export class InsufficientStockError extends AppError {
  constructor(productTitle, requested, available) {
    const message = `Insufficient stock for product '${productTitle}'. Requested: ${requested}, Available: ${available}`;
    super(message, 409, 'INSUFFICIENT_STOCK');
    this.productTitle = productTitle;
    this.requested = requested;
    this.available = available;
  }
}

/**
 * Global Express Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred.';

  // 1. Handle Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.errors.map((e) => e.message).join(', ');
  }

  // 2. Handle Unique Constraint Violations (e.g. duplicate email, sku)
  else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
    message = err.errors.map((e) => e.message).join(', ');
  }

  // 3. Handle PostgreSQL CHECK Constraint Violations (PostgreSQL code 23514)
  else if (err.name === 'SequelizeDatabaseError' && err.original?.code === '23514') {
    statusCode = 409;
    errorCode = 'INSUFFICIENT_STOCK_DB_CONSTRAINT';
    message = 'Transaction aborted: Product stock cannot drop below zero.';
  }

  // 4. Handle PostgreSQL Invalid Syntax / Malformed UUID (PostgreSQL code 22P02)
  else if (err.name === 'SequelizeDatabaseError' && err.original?.code === '22P02') {
    statusCode = 400;
    errorCode = 'INVALID_IDENTIFIER_FORMAT';
    message = 'Invalid identifier syntax. Expected a valid 36-character UUID.';
  }

  // 5. Handle Database Connection Errors
  else if (err.name === 'SequelizeConnectionRefusedError' || err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    errorCode = 'DATABASE_UNAVAILABLE';
    message = 'Database service is temporarily unavailable. Please try again later.';
  }

  // Diagnostic logging on server console
  if (statusCode >= 500) {
    console.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err.message);
  } else {
    console.warn(`[Client Error ${statusCode}] ${req.method} ${req.originalUrl} (${errorCode}): ${message}`);
  }

  // Clean, consistent, sanitized JSON response (never leaks raw database stack traces)
  res.status(statusCode).json({
    success: false,
    error: errorCode,
    message,
  });
}
