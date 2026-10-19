const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getRoleService = require('../services/getRole.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getRoleService({ roleId: req.params.roleId });
  return success(res, { data });
});
