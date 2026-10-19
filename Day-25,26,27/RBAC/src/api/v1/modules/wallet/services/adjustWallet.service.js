const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const creditWallet = require('./creditWallet.service');
const debitWallet = require('./debitWallet.service');
const recordTransaction = require('@v1/modules/transactions/transactions/services/recordTransaction.service');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');

const { Wallet } = models;

module.exports = async function adjustWallet({
  walletId,
  type,
  amount,
  note,
  actorType = 'admin',
  actorId = null
}) {
  const wallet = await Wallet.findByPk(walletId);
  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  const amt = Number(amount);
  if (!amt || amt <= 0) {
    throw ApiError.badRequest('Amount must be greater than 0');
  }

  const result = await sequelize.transaction(async (t) => {
    let walletResult;

    if (type === 'credit') {
      walletResult = await creditWallet({
        walletId: wallet.id,
        amount: amt,
        source: 'admin_adjustment',
        note,
        createdByType: actorType,
        createdById: actorId,
        transaction: t
      });
    } else if (type === 'debit') {
      walletResult = await debitWallet({
        walletId: wallet.id,
        amount: amt,
        source: 'admin_adjustment',
        note,
        createdByType: actorType,
        createdById: actorId,
        transaction: t
      });
    } else {
      throw ApiError.badRequest('Invalid adjustment type. Must be credit or debit');
    }

    const txn = await recordTransaction({
      userId: wallet.userId,
      type: 'admin_adjustment',
      direction: type,
      amount: amt,
      status: 'success',
      walletEntryId: walletResult.entry.id,
      description: note || 'Administrative balance adjustment',
      metadata: { adjustedBy: actorId, actorType },
      transaction: t
    });

    return {
      wallet: walletResult.wallet,
      entry: walletResult.entry,
      transaction: txn
    };
  });

  // Notify user after transaction commits
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: wallet.userId,
      type: 'wallet_adjusted',
      title: 'Wallet Balance Adjusted',
      body: `Your wallet balance has been adjusted (${type}: ${amt} minor units). Reason: ${note}`
    });
  } catch {
    // Failure to notify should not roll back adjustment
  }

  return result;
};
