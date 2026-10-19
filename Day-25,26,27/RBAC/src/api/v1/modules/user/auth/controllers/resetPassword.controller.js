const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const resetPasswordService = require('../services/resetPassword.service');

module.exports = asyncHandler(async (req, res) => {
  await resetPasswordService(req.body);
  return success(res, { message: 'Password has been reset successfully. Please login with your new password.' });
});
