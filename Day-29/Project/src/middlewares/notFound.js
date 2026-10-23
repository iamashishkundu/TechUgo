import { NotFoundError } from './errorHandler.js';

/**
 * 404 Fallback Middleware for unregistered routes
 */
export function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} does not exist.`));
}
