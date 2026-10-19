const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const changePasswordService = require('../services/changePassword.service');

module.exports = asyncHandler(async (req, res) => {
  await changePasswordService({
    adminId: req.auth.id,
    ...req.body
  });
  return success(res, { message: 'Password changed successfully. Please log in again.' });
});
