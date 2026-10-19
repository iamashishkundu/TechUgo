const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, Category, ProductVariant, ProductImage } = models;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

module.exports = async function updateProduct({
  productId,
  categoryId,
  name,
  slug,
  description,
  basePrice,
  isActive
}) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (categoryId !== undefined) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw ApiError.badRequest('Category not found');
    }
  }

  const updates = {};
  if (categoryId !== undefined) updates.categoryId = categoryId;
  if (name !== undefined) updates.name = name;
  if (slug !== undefined) {
    let finalSlug = slugify(slug);
    const existing = await Product.findOne({ where: { slug: finalSlug } });
    if (existing && existing.id !== productId) {
      finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
    }
    updates.slug = finalSlug;
  }
  if (description !== undefined) updates.description = description;
  if (basePrice !== undefined) updates.basePrice = basePrice;
  if (isActive !== undefined) updates.isActive = isActive;

  await product.update(updates);

  return await Product.findByPk(productId, {
    include: [
      { model: Category, as: 'category' },
      { model: ProductVariant, as: 'variants' },
      { model: ProductImage, as: 'images' }
    ]
  });
};
