const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getEffectivePermissionsService = require('../services/getEffectivePermissions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getEffectivePermissionsService({
    subadminId: req.params.subadminId
  });
  return success(res, { data });
});
