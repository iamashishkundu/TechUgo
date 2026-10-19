const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const topUpWalletService = require('../../services/topUpWallet.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await topUpWalletService({
    userId: req.auth.id,
    amount: req.body.amount
  });
  return success(res, {
    message: 'Wallet topped up successfully',
    data
  });
});
