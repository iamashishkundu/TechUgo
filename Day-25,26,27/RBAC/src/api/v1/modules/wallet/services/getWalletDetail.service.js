const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Wallet, User, WalletEntry } = models;

module.exports = async function getWalletDetail({ walletId }) {
  const wallet = await Wallet.findByPk(walletId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'status']
      },
      {
        model: WalletEntry,
        as: 'entries',
        limit: 50,
        order: [['createdAt', 'DESC']]
      }
    ]
  });

  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  return wallet;
};
