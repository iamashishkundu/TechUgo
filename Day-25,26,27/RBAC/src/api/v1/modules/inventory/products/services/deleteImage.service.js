const fs = require('fs');
const path = require('path');
const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { ProductImage } = models;

module.exports = async function deleteImage({ productId, imageId }) {
  const image = await ProductImage.findOne({
    where: { id: imageId, productId }
  });

  if (!image) {
    throw ApiError.notFound('Product image not found');
  }

  // Remove file from disk if possible
  try {
    const filename = path.basename(image.url);
    const filePath = path.resolve(process.cwd(), 'uploads', 'products', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Continue even if file removal fails
  }

  await image.destroy();

  return { success: true };
};
