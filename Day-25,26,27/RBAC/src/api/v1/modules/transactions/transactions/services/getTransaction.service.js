const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Transaction, User, Order } = models;

module.exports = async function getTransaction({ transactionId }) {
  const txn = await Transaction.findByPk(transactionId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      },
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'orderNumber', 'total']
      }
    ]
  });

  if (!txn) {
    throw ApiError.notFound('Transaction not found');
  }

  return txn;
};
