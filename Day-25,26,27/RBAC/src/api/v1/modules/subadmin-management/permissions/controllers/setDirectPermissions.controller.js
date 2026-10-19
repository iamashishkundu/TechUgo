const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const setDirectPermissionsService = require('../services/setDirectPermissions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await setDirectPermissionsService({
    subadminId: req.params.subadminId,
    allow: req.body.allow,
    deny: req.body.deny,
    permissions: req.body.permissions
  });
  return success(res, { message: 'Direct permissions updated successfully', data });
});
