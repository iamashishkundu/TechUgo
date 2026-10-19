const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Faq } = models;

module.exports = async function reorderFaqs({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest('items array is required');
  }

  await sequelize.transaction(async (t) => {
    for (const item of items) {
      if (!item.id || item.sortOrder === undefined) continue;
      await Faq.update(
        { sortOrder: item.sortOrder },
        { where: { id: item.id }, transaction: t }
      );
    }
  });

  return { success: true };
};
