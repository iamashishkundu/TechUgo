const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductVariant, StockMovement } = models;

module.exports = async function deductStock({
  variantId,
  quantity,
  referenceType = 'order',
  referenceId = null,
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

  if (currentStock < qty) {
    throw ApiError.badRequest(`Insufficient stock for variant SKU ${variant.sku}`);
  }

  const newStock = currentStock - qty;
  await variant.update({ stock: newStock }, { transaction });

  const movement = await StockMovement.create(
    {
      variantId,
      type: 'order',
      quantityChange: -qty,
      stockAfter: newStock,
      referenceType,
      referenceId,
      note: `Stock deducted for ${referenceType}`
    },
    { transaction }
  );

  const isLowStock = newStock <= variant.lowStockThreshold;

  return {
    variant,
    movement,
    isLowStock,
    sku: variant.sku,
    newStock
  };
};
