const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const refreshTokenService = require('../services/refreshToken.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await refreshTokenService({
    refreshToken: req.body.refreshToken,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.headers['x-forwarded-for']
  });
  return success(res, { message: 'Token refreshed successfully', data });
});
