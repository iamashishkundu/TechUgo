const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getWalletService = require('../../services/getWallet.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getWalletService({ userId: req.auth.id });
  return success(res, { data });
});
