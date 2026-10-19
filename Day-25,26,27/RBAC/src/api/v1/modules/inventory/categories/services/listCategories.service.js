const { models } = require('@db');

const { Category } = models;

module.exports = async function listCategories() {
  const categories = await Category.findAll({
    include: [
      { model: Category, as: 'parent' },
      { model: Category, as: 'children' }
    ],
    order: [['createdAt', 'DESC']]
  });

  return categories;
};
