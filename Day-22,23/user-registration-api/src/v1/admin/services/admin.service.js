const Admin = require('../models/admin.model');
const AppError = require('../../user/utils/AppError');
const { hashPassword } = require('../../user/utils/password');

const listUsers = () => Admin.findAll();

const getUser = async (id) => {
  const user = await Admin.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// Admins can also change role
const updateUser = async (id, { name, email, password, role }) => {
  await getUser(id);

  if (email !== undefined && (await Admin.emailExists(email, id))) {
    throw new AppError('Email already in use', 409);
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;
  if (role !== undefined) fields.role = role;
  if (password !== undefined) fields.passwordHash = await hashPassword(password);

  return Admin.update(id, fields);
};

const deleteUser = async (actorId, id) => {
  if (actorId === id) {
    throw new AppError('You cannot delete your own account', 400);
  }
  const deleted = await Admin.remove(id);
  if (!deleted) throw new AppError('User not found', 404);
};

module.exports = { listUsers, getUser, updateUser, deleteUser };
