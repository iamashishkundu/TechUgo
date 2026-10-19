const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductVariant } = models;

module.exports = async function deleteVariant({ productId, variantId }) {
  const variant = await ProductVariant.findOne({
    where: { id: variantId, productId }
  });

  if (!variant) {
    throw ApiError.notFound('Product variant not found');
  }

  await variant.destroy();

  return { success: true };
};
