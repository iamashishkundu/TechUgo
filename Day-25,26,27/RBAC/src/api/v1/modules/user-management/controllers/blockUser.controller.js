const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const blockUserService = require('../services/blockUser.service');

module.exports = asyncHandler(async (req, res) => {
  await blockUserService({ userId: req.params.userId });
  return success(res, { message: 'User blocked successfully' });
});
