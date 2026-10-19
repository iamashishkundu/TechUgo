const { models } = require('@db');

const { Faq, FaqCategory } = models;

module.exports = async function listFaqs() {
  const faqs = await Faq.findAll({
    include: [{ model: FaqCategory, as: 'category' }],
    order: [['sortOrder', 'ASC']]
  });

  return faqs;
};
