const { models } = require('@db');

const { FaqCategory } = models;

module.exports = async function createFaqCategory({ name, sortOrder = 0, isActive = true }) {
  const category = await FaqCategory.create({
    name,
    sortOrder: sortOrder || 0,
    isActive: isActive !== false
  });
  return category;
};
