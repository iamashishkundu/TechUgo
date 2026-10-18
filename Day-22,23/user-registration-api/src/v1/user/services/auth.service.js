const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

// Used so a login for an unknown email takes about as long as a wrong password
const dummyHash = hashPassword('not-a-real-password');

const register = async ({ name, email, password }) => {
  if (await User.emailExists(email)) {
    throw new AppError('Email already registered', 409);
  }
  const passwordHash = await hashPassword(password);
  // Role is never taken from input: new accounts are always 'user'
  return User.create({ name, email, passwordHash });
};

const login = async ({ email, password }) => {
  const user = await User.findByEmailWithPassword(email);
  const hash = user ? user.password_hash : await dummyHash;
  const passwordOk = await comparePassword(password, hash);

  // Same message for both cases, so attackers can't discover which emails exist
  if (!user || !passwordOk) {
    throw new AppError('Invalid email or password', 401);
  }

  const { password_hash, ...safeUser } = user; // strip the hash before returning
  const token = signToken({ id: user.id, role: user.role });
  return { token, user: safeUser };
};

module.exports = { register, login };
