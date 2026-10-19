const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Faq, FaqCategory } = models;

module.exports = async function updateFaq({ faqId, categoryId, question, answer, sortOrder, isActive }) {
  const faq = await Faq.findByPk(faqId);
  if (!faq) {
    throw ApiError.notFound('FAQ not found');
  }

  if (categoryId !== undefined) {
    const category = await FaqCategory.findByPk(categoryId);
    if (!category) {
      throw ApiError.badRequest('Specified FAQ category does not exist');
    }
  }

  const updates = {};
  if (categoryId !== undefined) updates.categoryId = categoryId;
  if (question !== undefined) updates.question = question;
  if (answer !== undefined) updates.answer = answer;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (isActive !== undefined) updates.isActive = isActive;

  await faq.update(updates);

  return await Faq.findByPk(faq.id, {
    include: [{ model: FaqCategory, as: 'category' }]
  });
};
