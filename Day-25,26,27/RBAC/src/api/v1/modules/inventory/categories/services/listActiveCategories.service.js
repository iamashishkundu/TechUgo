const { models } = require('@db');

const { Category } = models;

module.exports = async function listActiveCategories() {
  const categories = await Category.findAll({
    where: { isActive: true },
    include: [
      {
        model: Category,
        as: 'children',
        where: { isActive: true },
        required: false
      }
    ],
    order: [['name', 'ASC']]
  });

  return categories;
};
