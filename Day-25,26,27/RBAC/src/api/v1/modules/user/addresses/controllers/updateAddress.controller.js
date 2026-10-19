const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateAddressService = require('../services/updateAddress.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateAddressService({
    addressId: req.params.addressId,
    userId: req.auth.id,
    ...req.body
  });
  return success(res, { message: 'Address updated successfully', data });
});
