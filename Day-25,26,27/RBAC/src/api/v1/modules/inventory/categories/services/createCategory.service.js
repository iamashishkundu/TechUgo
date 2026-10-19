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

module.exports = async function createCategory({ name, slug, parentId, isActive = true }) {
  if (parentId) {
    const parent = await Category.findByPk(parentId);
    if (!parent) {
      throw ApiError.badRequest('Parent category not found');
    }
  }

  let finalSlug = slug ? slugify(slug) : slugify(name);
  const existing = await Category.findOne({ where: { slug: finalSlug } });
  if (existing) {
    finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
  }

  const category = await Category.create({
    name,
    slug: finalSlug,
    parentId: parentId || null,
    isActive: isActive !== false
  });

  return category;
};
