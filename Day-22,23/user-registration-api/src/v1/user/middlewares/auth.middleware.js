const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) throw new AppError('Authentication required', 401);

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new AppError('Authorization header must be: Bearer <token>', 401);
  }

  // Throws TokenExpiredError / JsonWebTokenError, which errorHandler maps to 401
  const payload = verifyToken(token);

  // Only copy what we need, from the verified token, never from the request body
  req.user = { id: payload.id, role: payload.role };
  next();
};

module.exports = authenticate;
