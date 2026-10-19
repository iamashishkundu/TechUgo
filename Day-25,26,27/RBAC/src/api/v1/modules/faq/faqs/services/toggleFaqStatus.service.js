const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Faq } = models;

module.exports = async function toggleFaqStatus({ faqId }) {
  const faq = await Faq.findByPk(faqId);
  if (!faq) {
    throw ApiError.notFound('FAQ not found');
  }

  await faq.update({ isActive: !faq.isActive });

  return {
    id: faq.id,
    isActive: faq.isActive
  };
};
