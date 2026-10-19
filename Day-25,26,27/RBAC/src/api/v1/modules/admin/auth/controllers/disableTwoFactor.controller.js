const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const disableTwoFactorService = require('../services/disableTwoFactor.service');

module.exports = asyncHandler(async (req, res) => {
  await disableTwoFactorService({
    adminId: req.auth.id,
    password: req.body.password,
    code: req.body.code
  });
  return success(res, { message: 'Two-factor authentication disabled successfully' });
});
