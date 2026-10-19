const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const uploadImagesService = require('../../services/uploadImages.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await uploadImagesService({
    productId: req.params.productId,
    files: req.files,
    variantId: req.body.variantId,
    isPrimary: req.body.isPrimary === 'true' || req.body.isPrimary === true
  });
  return success(res, {
    statusCode: 201,
    message: 'Images uploaded successfully',
    data
  });
});
