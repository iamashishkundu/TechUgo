const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Invoice, User, Order } = models;

module.exports = async function getInvoice({ invoiceId }) {
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      },
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
