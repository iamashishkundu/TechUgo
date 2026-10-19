const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { User, Address, Wallet } = models;

module.exports = async function getUser({ userId }) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['passwordHash', 'deletedAt'] },
    include: [
      { model: Address, as: 'addresses' },
      { model: Wallet, as: 'wallet' }
    ]
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};
