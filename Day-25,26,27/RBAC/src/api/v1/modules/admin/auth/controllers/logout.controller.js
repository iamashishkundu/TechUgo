const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const logoutService = require('../services/logout.service');

module.exports = asyncHandler(async (req, res) => {
  await logoutService({ sessionId: req.auth.sessionId });
  return success(res, { message: 'Logged out successfully' });
});
