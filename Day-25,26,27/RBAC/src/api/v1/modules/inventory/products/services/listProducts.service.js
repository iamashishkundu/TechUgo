const { Op } = require('sequelize');
const { models } = require('@db');

const { Product, Category, ProductVariant, ProductImage } = models;

module.exports = async function listProducts({
  categoryId,
  isActive,
  search,
  page = 1,
  limit = 20
} = {}) {
  const where = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === true || isActive === 'true';
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { slug: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category' },
      { model: ProductVariant, as: 'variants' },
      { model: ProductImage, as: 'images' }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset,
    distinct: true
  });

  return {
    products: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
