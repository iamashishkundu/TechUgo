const { models } = require('@db');

const { User, Wallet } = models;

module.exports = async function listUsers() {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'deletedAt'] },
    include: [{ model: Wallet, as: 'wallet', attributes: ['balance', 'currency'] }],
    order: [['createdAt', 'DESC']]
  });

  return users;
};
