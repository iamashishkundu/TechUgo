const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Category, Product } = models;

module.exports = async function getCategory({ categoryId }) {
  const category = await Category.findByPk(categoryId, {
    include: [
      { model: Category, as: 'parent' },
      { model: Category, as: 'children' },
      { model: Product, as: 'products' }
    ]
  });

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return category;
};
