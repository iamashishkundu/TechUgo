const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { FaqCategory } = models;

module.exports = async function deleteFaqCategory({ categoryId }) {
  const category = await FaqCategory.findByPk(categoryId);
  if (!category) {
    throw ApiError.notFound('FAQ category not found');
  }

  await category.destroy();
  return { success: true };
};
