const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteAddressService = require('../services/deleteAddress.service');

module.exports = asyncHandler(async (req, res) => {
  await deleteAddressService({
    addressId: req.params.addressId,
    userId: req.auth.id
  });
  return success(res, { message: 'Address deleted successfully' });
});
