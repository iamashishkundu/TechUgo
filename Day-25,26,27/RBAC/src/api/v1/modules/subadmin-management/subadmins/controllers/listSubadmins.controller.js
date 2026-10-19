const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listSubadminsService = require('../services/listSubadmins.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listSubadminsService();
  return success(res, { data });
});
