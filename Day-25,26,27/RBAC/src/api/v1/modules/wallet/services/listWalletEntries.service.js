const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Wallet, WalletEntry } = models;

module.exports = async function listWalletEntries({ userId, page = 1, limit = 20 } = {}) {
  const wallet = await Wallet.findOne({ where: { userId } });
  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await WalletEntry.findAndCountAll({
    where: { walletId: wallet.id },
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    entries: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
