const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const loginService = require('../services/login.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await loginService({
    ...req.body,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.headers['x-forwarded-for']
  });

  if (data.twoFactorRequired) {
    return success(res, {
      message: 'Two-factor authentication required',
      data: {
        twoFactorRequired: true,
        twoFactorToken: data.twoFactorToken
      }
    });
  }

  return success(res, { message: 'Login successful', data });
});
