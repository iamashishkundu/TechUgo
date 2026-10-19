const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, Category, ProductVariant, ProductImage } = models;

module.exports = async function getActiveProduct({ productId }) {
  const product = await Product.findOne({
    where: { id: productId, isActive: true },
    include: [
      {
        model: Category,
        as: 'category',
        where: { isActive: true },
        attributes: ['id', 'name', 'slug']
      },
      {
        model: ProductVariant,
        as: 'variants',
        where: { isActive: true },
        required: false,
        attributes: ['id', 'sku', 'attributes', 'price', 'stock', 'isActive'],
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['id', 'url', 'sortOrder', 'isPrimary']
          }
        ]
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'sortOrder', 'isPrimary']
      }
    ]
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const plain = product.toJSON();
  if (plain.variants) {
    plain.variants = plain.variants.map((v) => {
      const inStock = (v.stock || 0) > 0;
      delete v.stock;
      delete v.lowStockThreshold;
      return {
        ...v,
        inStock
      };
    });
  }

  return plain;
};
