const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Category } = models;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

module.exports = async function updateCategory({ categoryId, name, slug, parentId, isActive }) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  if (parentId !== undefined) {
    if (parentId === categoryId) {
      throw ApiError.badRequest('A category cannot be its own parent');
    }
    if (parentId !== null) {
      const parent = await Category.findByPk(parentId);
      if (!parent) {
        throw ApiError.badRequest('Parent category not found');
      }
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (slug !== undefined) {
    let finalSlug = slugify(slug);
    const existing = await Category.findOne({
      where: { slug: finalSlug }
    });
    if (existing && existing.id !== categoryId) {
      finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
    }
    updates.slug = finalSlug;
  }
  if (parentId !== undefined) updates.parentId = parentId;
  if (isActive !== undefined) updates.isActive = isActive;

  await category.update(updates);

  return await Category.findByPk(categoryId, {
    include: [
      { model: Category, as: 'parent' },
      { model: Category, as: 'children' }
    ]
  });
};
