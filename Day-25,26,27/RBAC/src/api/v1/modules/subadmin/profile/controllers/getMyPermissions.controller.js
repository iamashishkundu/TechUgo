const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getMyPermissionsService = require('../services/getMyPermissions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getMyPermissionsService({ subadminId: req.auth.id });
  return success(res, { data });
});
