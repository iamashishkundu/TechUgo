require('dotenv').config();
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from .env'); // fail fast at startup
}

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

// Pinning the algorithm on verify blocks "alg" confusion attacks
const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

module.exports = { signToken, verifyToken };
