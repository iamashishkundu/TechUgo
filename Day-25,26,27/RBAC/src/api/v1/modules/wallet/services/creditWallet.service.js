const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Wallet, WalletEntry } = models;

module.exports = async function creditWallet({
  walletId,
  userId,
  amount,
  source,
  referenceType = null,
  referenceId = null,
  note = null,
  createdByType = null,
  createdById = null,
  transaction
}) {
  const amt = Number(amount);
  if (!amt || amt <= 0) {
    throw ApiError.badRequest('Credit amount must be greater than 0');
  }

  const where = {};
  if (walletId) where.id = walletId;
  else if (userId) where.userId = userId;
  else throw ApiError.badRequest('walletId or userId is required');

  const wallet = await Wallet.findOne({
    where,
    lock: transaction ? transaction.LOCK.UPDATE : true,
    transaction
  });

  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  const currentBalance = Number(wallet.balance) || 0;
  const newBalance = currentBalance + amt;

  await wallet.update({ balance: newBalance }, { transaction });

  const entry = await WalletEntry.create(
    {
      walletId: wallet.id,
      type: 'credit',
      amount: amt,
      balanceAfter: newBalance,
      source,
      referenceType,
      referenceId,
      note,
      createdByType,
      createdById
    },
    { transaction }
  );

  return { wallet, entry };
};
