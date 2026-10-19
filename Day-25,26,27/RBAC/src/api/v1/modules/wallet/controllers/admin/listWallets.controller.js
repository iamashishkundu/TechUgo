const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listWalletsService = require('../../services/listWallets.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listWalletsService(req.query);
  return success(res, { data });
});
