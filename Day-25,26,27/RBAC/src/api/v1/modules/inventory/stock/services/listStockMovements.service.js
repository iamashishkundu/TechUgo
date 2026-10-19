const { models } = require('@db');

const { StockMovement, ProductVariant, Product } = models;

module.exports = async function listStockMovements({
  variantId,
  type,
  page = 1,
  limit = 20
} = {}) {
  const where = {};
  if (variantId) where.variantId = variantId;
  if (type) where.type = type;

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await StockMovement.findAndCountAll({
    where,
    include: [
      {
        model: ProductVariant,
        as: 'variant',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'slug'] }]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    movements: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
