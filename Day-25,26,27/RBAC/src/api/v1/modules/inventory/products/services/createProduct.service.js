const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, Category, ProductVariant, ProductImage, StockMovement } = models;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

module.exports = async function createProduct({
  categoryId,
  name,
  slug,
  description,
  basePrice,
  isActive = true,
  variants = []
}) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw ApiError.badRequest('Category not found');
  }

  let finalSlug = slug ? slugify(slug) : slugify(name);
  const existing = await Product.findOne({ where: { slug: finalSlug } });
  if (existing) {
    finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
  }

  return await sequelize.transaction(async (t) => {
    const product = await Product.create(
      {
        categoryId,
        name,
        slug: finalSlug,
        description,
        basePrice,
        isActive: isActive !== false
      },
      { transaction: t }
    );

    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        const initialStock = v.stock ? Number(v.stock) : 0;
        const variant = await ProductVariant.create(
          {
            productId: product.id,
            sku: v.sku,
            attributes: v.attributes || {},
            price: v.price !== undefined ? v.price : null,
            stock: initialStock,
            lowStockThreshold: v.lowStockThreshold !== undefined ? v.lowStockThreshold : 5,
            isActive: v.isActive !== false
          },
          { transaction: t }
        );

        if (initialStock > 0) {
          await StockMovement.create(
            {
              variantId: variant.id,
              type: 'initial',
              quantityChange: initialStock,
              stockAfter: initialStock,
              note: 'Initial stock'
            },
            { transaction: t }
          );
        }
      }
    }

    return await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductVariant, as: 'variants' },
        { model: ProductImage, as: 'images' }
      ],
      transaction: t
    });
  });
};
