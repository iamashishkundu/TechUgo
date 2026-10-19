const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const dummyGateway = require('@services/payment/dummyGateway');
const creditWallet = require('./creditWallet.service');
const recordTransaction = require('@v1/modules/transactions/transactions/services/recordTransaction.service');

const { Wallet } = models;

module.exports = async function topUpWallet({ userId, amount }) {
  const amt = Number(amount);
  if (!amt || amt < 1 || amt > 10000000) {
    throw ApiError.badRequest('Amount must be between 1 and 10,000,000 minor units');
  }

  const wallet = await Wallet.findOne({ where: { userId } });
  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  const chargeResult = await dummyGateway.charge({ amount: amt });
  if (!chargeResult.success) {
    throw ApiError.badRequest(chargeResult.error || 'Payment gateway charge failed');
  }

  return await sequelize.transaction(async (t) => {
    const { wallet: updatedWallet, entry } = await creditWallet({
      walletId: wallet.id,
      amount: amt,
      source: 'topup',
      note: 'Wallet top-up',
      createdByType: 'user',
      createdById: userId,
      transaction: t
    });

    const txn = await recordTransaction({
      userId,
      type: 'wallet_topup',
      direction: 'credit',
      amount: amt,
      status: 'success',
      walletEntryId: entry.id,
      description: 'Wallet top-up via dummy gateway',
      metadata: { gatewayReference: chargeResult.reference },
      transaction: t
    });

    return {
      wallet: updatedWallet,
      entry,
      transaction: txn
    };
  });
};
