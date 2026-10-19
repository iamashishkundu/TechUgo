const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteImageService = require('../../services/deleteImage.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteImageService({
    productId: req.params.productId,
    imageId: req.params.imageId
  });
  return success(res, {
    message: 'Image deleted successfully',
    data
  });
});
