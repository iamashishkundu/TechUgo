const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateProfileService = require('../services/updateProfile.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateProfileService({
    adminId: req.auth.id,
    ...req.body
  });
  return success(res, { message: 'Profile updated successfully', data });
});
