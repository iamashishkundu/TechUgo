const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const unblockUserService = require('../services/unblockUser.service');

module.exports = asyncHandler(async (req, res) => {
  await unblockUserService({ userId: req.params.userId });
  return success(res, { message: 'User unblocked successfully' });
});
