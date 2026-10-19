const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductVariant, StockMovement } = models;

module.exports = async function restoreStock({
  variantId,
  quantity,
  referenceType = 'order',
  referenceId = null,
  note = 'Stock restored',
  type = 'cancellation',
  transaction
}) {
  const variant = await ProductVariant.findByPk(variantId, {
    lock: transaction ? transaction.LOCK.UPDATE : true,
    transaction
  });

  if (!variant) {
    throw ApiError.notFound('Product variant not found');
  }

  const currentStock = Number(variant.stock) || 0;
  const qty = Number(quantity);
  const newStock = currentStock + qty;

  await variant.update({ stock: newStock }, { transaction });

  const movement = await StockMovement.create(
    {
      variantId,
      type,
      quantityChange: qty,
      stockAfter: newStock,
      referenceType,
      referenceId,
      note
    },
    { transaction }
  );

  return { variant, movement };
};
