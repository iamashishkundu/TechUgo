const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteRoleService = require('../services/deleteRole.service');

module.exports = asyncHandler(async (req, res) => {
  await deleteRoleService({ roleId: req.params.roleId });
  return success(res, { message: 'Role deleted successfully' });
});
