const { models } = require('@db');

const { Wallet, User } = models;

module.exports = async function listWallets({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Wallet.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'status']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    wallets: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
