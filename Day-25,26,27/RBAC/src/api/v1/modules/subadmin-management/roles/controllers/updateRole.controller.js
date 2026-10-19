const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateRoleService = require('../services/updateRole.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateRoleService({
    roleId: req.params.roleId,
    ...req.body
  });
  return success(res, { message: 'Role updated successfully', data });
});
