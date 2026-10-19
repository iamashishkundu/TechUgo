const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const verifyTwoFactorLoginService = require('../services/verifyTwoFactorLogin.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await verifyTwoFactorLoginService({
    ...req.body,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.headers['x-forwarded-for']
  });
  return success(res, { message: 'Two-factor login verified successfully', data });
});
