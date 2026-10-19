const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Transaction, Order } = models;

module.exports = async function getMyTransaction({ userId, transactionId }) {
  const txn = await Transaction.findOne({
    where: { id: transactionId, userId },
    include: [
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
