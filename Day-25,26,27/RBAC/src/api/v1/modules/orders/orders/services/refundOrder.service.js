const ApiError = require('@utils/ApiError');
const { ORDER_PAYMENT_STATUS } = require('@constants/orderStatus');
const creditWallet = require('@v1/modules/wallet/services/creditWallet.service');
const recordTransaction = require('@v1/modules/transactions/transactions/services/recordTransaction.service');

module.exports = async function refundOrder({ order, transaction }) {
  if (order.paymentStatus === ORDER_PAYMENT_STATUS.REFUNDED) {
    throw ApiError.conflict('Order has already been refunded');
  }

  const { entry } = await creditWallet({
    userId: order.userId,
    amount: order.total,
    source: 'refund',
    referenceType: 'order',
    referenceId: order.id,
    note: `Refund for order ${order.orderNumber}`,
    transaction
  });

  await recordTransaction({
    userId: order.userId,
    type: 'refund',
    direction: 'credit',
    amount: order.total,
    status: 'success',
    orderId: order.id,
    walletEntryId: entry.id,
    description: `Refund for order ${order.orderNumber}`,
    transaction
  });

  await order.update(
    { paymentStatus: ORDER_PAYMENT_STATUS.REFUNDED },
    { transaction }
  );

  return { success: true, refundedAmount: order.total };
};
