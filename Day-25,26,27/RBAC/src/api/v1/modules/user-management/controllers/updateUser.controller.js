const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateUserService = require('../services/updateUser.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateUserService({
    userId: req.params.userId,
    ...req.body
  });
  return success(res, { message: 'User updated successfully', data });
});
