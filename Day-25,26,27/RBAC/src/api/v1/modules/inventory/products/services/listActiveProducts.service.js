const { Op } = require('sequelize');
const { models } = require('@db');

const { Product, Category, ProductVariant, ProductImage } = models;

module.exports = async function listActiveProducts({
  categoryId,
  search,
  page = 1,
  limit = 20
} = {}) {
  const where = { isActive: true };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Product.findAndCountAll({
    where,
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
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset,
    distinct: true
  });

  // Never expose stock numbers in public catalog: map to inStock
  const transformedProducts = rows.map((product) => {
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
  });

  return {
    products: transformedProducts,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
