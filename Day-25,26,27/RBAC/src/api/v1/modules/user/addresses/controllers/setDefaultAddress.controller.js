const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const setDefaultAddressService = require('../services/setDefaultAddress.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await setDefaultAddressService({
    addressId: req.params.addressId,
    userId: req.auth.id
  });
  return success(res, { message: 'Default address updated successfully', data });
});
