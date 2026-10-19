const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Category, Product } = models;

module.exports = async function deleteCategory({ categoryId }) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  const activeProductsCount = await Product.count({
    where: {
      categoryId,
      isActive: true
    }
  });

  if (activeProductsCount > 0) {
    throw ApiError.conflict('Cannot delete category with active products');
  }

  await category.destroy();

  return { success: true };
};
