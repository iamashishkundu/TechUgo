const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const forgotPasswordService = require('../services/forgotPassword.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await forgotPasswordService(req.body);
  return success(res, {
    message: data.message || 'If the email exists, a password reset link has been sent',
    data: data.devToken ? { devToken: data.devToken } : null
  });
});
