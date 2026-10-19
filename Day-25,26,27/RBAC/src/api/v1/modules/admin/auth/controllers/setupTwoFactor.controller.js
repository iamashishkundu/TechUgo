const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const setupTwoFactorService = require('../services/setupTwoFactor.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await setupTwoFactorService({ adminId: req.auth.id });
  return success(res, { message: 'Two-factor authentication setup initiated', data });
});
