const { models } = require('@db');
const { generateInvoiceNumber } = require('@utils/orderNumber');

const { Invoice } = models;

module.exports = async function createInvoice({
  orderId,
  userId,
  subtotal,
  discountAmount = 0,
  total,
  snapshot,
  issuedAt = new Date(),
  transaction
}) {
  const invoiceNumber = generateInvoiceNumber();

  return await Invoice.create(
    {
      invoiceNumber,
      orderId,
      userId,
      subtotal,
      discountAmount,
      total,
      issuedAt,
      snapshot
    },
    { transaction }
  );
};
