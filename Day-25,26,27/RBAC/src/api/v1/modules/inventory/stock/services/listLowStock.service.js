const { Op, col, where: seqWhere } = require('sequelize');
const { models } = require('@db');

const { ProductVariant, Product } = models;

module.exports = async function listLowStock({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await ProductVariant.findAndCountAll({
    where: {
      isActive: true,
      [Op.and]: [
        seqWhere(col('stock'), '<=', col('low_stock_threshold'))
      ]
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      }
    ],
    order: [['stock', 'ASC']],
    limit: Number(limit),
    offset
  });

  return {
    variants: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
