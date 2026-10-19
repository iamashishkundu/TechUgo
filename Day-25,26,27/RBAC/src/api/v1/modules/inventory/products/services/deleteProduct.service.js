const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, ProductVariant } = models;

module.exports = async function deleteProduct({ productId }) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  await sequelize.transaction(async (t) => {
    // Soft delete associated variants as well
    await ProductVariant.destroy({
      where: { productId },
      transaction: t
    });

    await product.destroy({ transaction: t });
  });

  return { success: true };
};
