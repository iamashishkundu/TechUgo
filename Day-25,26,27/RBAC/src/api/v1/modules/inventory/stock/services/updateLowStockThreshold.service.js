const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductVariant } = models;

module.exports = async function updateLowStockThreshold({ variantId, lowStockThreshold }) {
  const variant = await ProductVariant.findByPk(variantId);
  if (!variant) {
    throw ApiError.notFound('Product variant not found');
  }

  await variant.update({
    lowStockThreshold: Number(lowStockThreshold)
  });

  return variant;
};
