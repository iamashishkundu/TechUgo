const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Faq } = models;

module.exports = async function deleteFaq({ faqId }) {
  const faq = await Faq.findByPk(faqId);
  if (!faq) {
    throw ApiError.notFound('FAQ not found');
  }

  await faq.destroy();
  return { success: true };
};
