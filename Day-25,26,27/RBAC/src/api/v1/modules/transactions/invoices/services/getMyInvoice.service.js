const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Invoice, Order } = models;

module.exports = async function getMyInvoice({ userId, invoiceId }) {
  const invoice = await Invoice.findOne({
    where: { id: invoiceId, userId },
    include: [
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'orderNumber', 'status', 'total']
      }
    ]
  });

  if (!invoice) {
    throw ApiError.notFound('Invoice not found');
  }

  return invoice;
};
