const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const verifyEmailService = require('../services/verifyEmail.service');

module.exports = asyncHandler(async (req, res) => {
  await verifyEmailService(req.body);
  return success(res, { message: 'Email verified successfully. You can now login.' });
});
