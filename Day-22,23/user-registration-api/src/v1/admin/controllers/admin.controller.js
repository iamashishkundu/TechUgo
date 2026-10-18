const adminService = require('../services/admin.service');

const listUsers = async (req, res) => {
  const users = await adminService.listUsers();
  res.status(200).json({ success: true, data: users });
};

const getUser = async (req, res) => {
  const user = await adminService.getUser(req.validated.params.id);
  res.status(200).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const user = await adminService.updateUser(req.validated.params.id, req.body);
  res.status(200).json({ success: true, data: user });
};

const deleteUser = async (req, res) => {
  await adminService.deleteUser(req.user.id, req.validated.params.id);
  res.status(204).end();
};

module.exports = { listUsers, getUser, updateUser, deleteUser };
