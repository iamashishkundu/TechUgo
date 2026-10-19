const { models } = require('@db');
const { generateTransactionNumber } = require('@utils/orderNumber');

const { Transaction } = models;

module.exports = async function recordTransaction({
  userId,
  type,
  direction,
  amount,
  status = 'success',
  orderId = null,
  walletEntryId = null,
  description = '',
  metadata = null,
  transaction
}) {
  const transactionNumber = generateTransactionNumber();

  return await Transaction.create(
    {
      transactionNumber,
      userId,
      type,
      direction,
      amount,
      status,
      orderId,
      walletEntryId,
      description,
      metadata
    },
    { transaction }
  );
};
