const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductVariant } = models;

module.exports = async function updateVariant({
  productId,
  variantId,
  sku,
  attributes,
  price,
  lowStockThreshold,
  isActive
}) {
  const variant = await ProductVariant.findOne({
    where: { id: variantId, productId }
  });

  if (!variant) {
    throw ApiError.notFound('Product variant not found');
  }

  if (sku && sku !== variant.sku) {
    const existingSku = await ProductVariant.findOne({ where: { sku } });
    if (existingSku) {
      throw ApiError.conflict('SKU already exists');
    }
  }

  const updates = {};
  if (sku !== undefined) updates.sku = sku;
  if (attributes !== undefined) updates.attributes = attributes;
  if (price !== undefined) updates.price = price;
  if (lowStockThreshold !== undefined) updates.lowStockThreshold = lowStockThreshold;
  if (isActive !== undefined) updates.isActive = isActive;

  await variant.update(updates);

  return variant;
};
