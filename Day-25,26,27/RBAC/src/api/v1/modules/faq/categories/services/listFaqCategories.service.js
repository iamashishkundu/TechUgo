const { models } = require('@db');

const { FaqCategory, Faq } = models;

module.exports = async function listFaqCategories() {
  const categories = await FaqCategory.findAll({
    include: [{ model: Faq, as: 'faqs' }],
    order: [['sortOrder', 'ASC']]
  });

  return categories;
};
