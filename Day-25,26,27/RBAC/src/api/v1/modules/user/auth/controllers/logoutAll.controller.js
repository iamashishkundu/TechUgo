const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const logoutAllService = require('../services/logoutAll.service');

module.exports = asyncHandler(async (req, res) => {
  await logoutAllService({ userId: req.auth.id });
  return success(res, { message: 'Logged out from all sessions successfully' });
});
