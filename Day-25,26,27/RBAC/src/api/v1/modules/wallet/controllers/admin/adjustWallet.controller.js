const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const adjustWalletService = require('../../services/adjustWallet.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await adjustWalletService({
    walletId: req.params.walletId,
    type: req.body.type,
    amount: req.body.amount,
    note: req.body.note,
    actorType: req.auth.actorType,
    actorId: req.auth.id
  });
  return success(res, {
    message: 'Wallet adjusted successfully',
    data
  });
});
