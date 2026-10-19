const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listUsersService = require('../services/listUsers.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listUsersService();
  return success(res, { data });
});
