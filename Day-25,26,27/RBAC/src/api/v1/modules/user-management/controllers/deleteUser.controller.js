const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteUserService = require('../services/deleteUser.service');

module.exports = asyncHandler(async (req, res) => {
  await deleteUserService({ userId: req.params.userId });
  return success(res, { message: 'User deleted successfully' });
});
