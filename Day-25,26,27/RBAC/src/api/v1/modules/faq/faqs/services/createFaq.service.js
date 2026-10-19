const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Faq, FaqCategory } = models;

module.exports = async function createFaq({ categoryId, question, answer, sortOrder = 0, isActive = true }) {
  const category = await FaqCategory.findByPk(categoryId);
  if (!category) {
    throw ApiError.badRequest('Specified FAQ category does not exist');
  }

  const faq = await Faq.create({
    categoryId,
    question,
    answer,
    sortOrder: sortOrder || 0,
    isActive: isActive !== false
  });

  return await Faq.findByPk(faq.id, {
    include: [{ model: FaqCategory, as: 'category' }]
  });
};
