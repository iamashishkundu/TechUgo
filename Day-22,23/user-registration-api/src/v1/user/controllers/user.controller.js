const userService = require('../services/user.service');

const getMe = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.status(200).json({ success: true, data: user });
};

const updateMe = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, data: user });
};

module.exports = { getMe, updateMe };
