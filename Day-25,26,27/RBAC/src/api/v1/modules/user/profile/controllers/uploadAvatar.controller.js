const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const uploadAvatarService = require('../services/uploadAvatar.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await uploadAvatarService({
    userId: req.auth.id,
    file: req.file
  });
  return success(res, { message: 'Avatar uploaded successfully', data });
});
