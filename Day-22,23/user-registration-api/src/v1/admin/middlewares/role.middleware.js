const AppError = require('../../user/utils/AppError');

// Usage: authorize('admin') or authorize('admin', 'moderator')
const authorize = (...allowedRoles) => (req, res, next) => {
  // Safety net: authorize must run after authenticate
  if (!req.user) throw new AppError('Authentication required', 401);

  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError('You do not have permission to do this', 403);
  }
  next();
};

module.exports = authorize;
