const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Wallet } = models;

module.exports = async function getWallet({ userId }) {
  const wallet = await Wallet.findOne({ where: { userId } });
  if (!wallet) {
    throw ApiError.notFound('Wallet not found');
  }

  return wallet;
};
