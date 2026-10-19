const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { FaqCategory } = models;

module.exports = async function updateFaqCategory({ categoryId, name, sortOrder, isActive }) {
  const category = await FaqCategory.findByPk(categoryId);
  if (!category) {
    throw ApiError.notFound('FAQ category not found');
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (isActive !== undefined) updates.isActive = isActive;

  await category.update(updates);
  return category;
};
