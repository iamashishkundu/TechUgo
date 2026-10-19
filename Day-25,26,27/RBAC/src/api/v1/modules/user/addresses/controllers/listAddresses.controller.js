const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listAddressesService = require('../services/listAddresses.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listAddressesService({ userId: req.auth.id });
  return success(res, { data });
});
