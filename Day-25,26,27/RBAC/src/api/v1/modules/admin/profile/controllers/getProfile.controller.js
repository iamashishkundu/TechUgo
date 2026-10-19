const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getProfileService = require('../services/getProfile.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getProfileService({ adminId: req.auth.id });
  return success(res, { data });
});
