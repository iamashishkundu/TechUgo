const asyncHandler = require('@utils/asyncHandler');
const { created } = require('@utils/apiResponse');
const addAddressService = require('../services/addAddress.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await addAddressService({
    userId: req.auth.id,
    ...req.body
  });
  return created(res, { message: 'Address added successfully', data });
});
