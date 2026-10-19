const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listRolesService = require('../services/listRoles.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listRolesService();
  return success(res, { data });
});
