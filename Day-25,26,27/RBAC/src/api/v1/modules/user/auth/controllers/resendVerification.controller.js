const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const resendVerificationService = require('../services/resendVerification.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await resendVerificationService(req.body);
  return success(res, {
    message: data.message || 'Verification link sent',
    data: data.devToken ? { devToken: data.devToken } : null
  });
});
