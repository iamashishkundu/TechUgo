const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Product, ProductImage } = models;

module.exports = async function uploadImages({ productId, files, variantId = null, isPrimary = false }) {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (!files || files.length === 0) {
    throw ApiError.badRequest('No images uploaded');
  }

  const existingCount = await ProductImage.count({ where: { productId } });

  const imageRecords = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = `/uploads/products/${file.filename}`;
    const image = await ProductImage.create({
      productId,
      variantId: variantId || null,
      url,
      sortOrder: existingCount + i,
      isPrimary: i === 0 && (isPrimary || existingCount === 0)
    });
    imageRecords.push(image);
  }

  return imageRecords;
};
