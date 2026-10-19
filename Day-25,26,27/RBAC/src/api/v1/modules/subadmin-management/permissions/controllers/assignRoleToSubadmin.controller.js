const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const assignRoleToSubadminService = require('../services/assignRoleToSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await assignRoleToSubadminService({
    subadminId: req.params.subadminId,
    roleId: req.body.roleId
  });
  return success(res, { message: 'Role assigned successfully', data });
});
