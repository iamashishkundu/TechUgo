const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const enableTwoFactorService = require('../services/enableTwoFactor.service');

module.exports = asyncHandler(async (req, res) => {
  await enableTwoFactorService({
    subadminId: req.auth.id,
    code: req.body.code
  });
  return success(res, { message: 'Two-factor authentication enabled successfully' });
});
