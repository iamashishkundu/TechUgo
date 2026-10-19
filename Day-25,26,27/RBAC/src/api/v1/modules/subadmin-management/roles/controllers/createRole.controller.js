const asyncHandler = require('@utils/asyncHandler');
const { created } = require('@utils/apiResponse');
const createRoleService = require('../services/createRole.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createRoleService(req.body);
  return created(res, { message: 'Role created successfully', data });
});
