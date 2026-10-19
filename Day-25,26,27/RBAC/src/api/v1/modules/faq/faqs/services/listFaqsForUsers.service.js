const { models } = require('@db');

const { FaqCategory, Faq } = models;

module.exports = async function listFaqsForUsers() {
  const categories = await FaqCategory.findAll({
    where: { isActive: true },
    include: [
      {
        model: Faq,
        as: 'faqs',
        where: { isActive: true },
        required: false
      }
    ],
    order: [
      ['sortOrder', 'ASC'],
      [{ model: Faq, as: 'faqs' }, 'sortOrder', 'ASC']
    ]
  });

  return categories;
};
