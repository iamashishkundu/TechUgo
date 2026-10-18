const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const { hashPassword } = require('../utils/password');

const getProfile = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// A normal user can change name, email, and password. Never role.
const updateProfile = async (id, { name, email, password }) => {
  await getProfile(id); // throws 404 if missing

  if (email !== undefined && (await User.emailExists(email, id))) {
    throw new AppError('Email already in use', 409);
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;
  if (password !== undefined) fields.passwordHash = await hashPassword(password);

  return User.update(id, fields);
};

module.exports = { getProfile, updateProfile };
