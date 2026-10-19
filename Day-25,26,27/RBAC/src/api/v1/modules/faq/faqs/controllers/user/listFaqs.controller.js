const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listFaqsForUsersService = require('../../services/listFaqsForUsers.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listFaqsForUsersService();
  return success(res, { data });
});
