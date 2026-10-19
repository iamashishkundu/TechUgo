const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, Category, ProductVariant, ProductImage } = models;

module.exports = async function getProduct({ productId }) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: Category, as: 'category' },
      {
        model: ProductVariant,
        as: 'variants',
        include: [{ model: ProductImage, as: 'images' }]
      },
      { model: ProductImage, as: 'images' }
    ]
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return product;
};
