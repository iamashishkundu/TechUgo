const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, ProductVariant, StockMovement } = models;

module.exports = async function addVariant({
  productId,
  sku,
  attributes = {},
  price = null,
  stock = 0,
  lowStockThreshold = 5,
  isActive = true
}) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const existingSku = await ProductVariant.findOne({ where: { sku } });
  if (existingSku) {
    throw ApiError.conflict('SKU already exists');
  }

  const initialStock = stock ? Number(stock) : 0;

  return await sequelize.transaction(async (t) => {
    const variant = await ProductVariant.create(
      {
        productId,
        sku,
        attributes,
        price: price !== undefined ? price : null,
        stock: initialStock,
        lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : 5,
        isActive: isActive !== false
      },
      { transaction: t }
    );

    if (initialStock > 0) {
      await StockMovement.create(
        {
          variantId: variant.id,
          type: 'initial',
          quantityChange: initialStock,
          stockAfter: initialStock,
          note: 'Initial stock'
        },
        { transaction: t }
      );
    }

    return variant;
  });
};
