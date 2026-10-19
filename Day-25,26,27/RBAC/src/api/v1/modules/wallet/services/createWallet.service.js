const { models } = require('@db');

const { Wallet } = models;

/**
 * Creates a zero-balance wallet for a user.
 * @param {Object} input
 * @param {string} input.userId - ID of the user
 * @param {string} [input.currency='INR'] - Wallet currency
 * @param {Object} [options]
 * @param {import('sequelize').Transaction} [options.transaction]
 * @returns {Promise<models.Wallet>}
 */
module.exports = async function createWallet({ userId, currency = 'INR' }, { transaction } = {}) {
  const existing = await Wallet.findOne({ where: { userId }, transaction });
  if (existing) {
    return existing;
  }

  const wallet = await Wallet.create(
    {
      userId,
      balance: 0,
      currency
    },
    { transaction }
  );

  return wallet;
};
