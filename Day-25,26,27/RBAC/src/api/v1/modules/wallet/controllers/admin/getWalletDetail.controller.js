const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getWalletDetailService = require('../../services/getWalletDetail.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getWalletDetailService({ walletId: req.params.walletId });
  return success(res, { data });
});
