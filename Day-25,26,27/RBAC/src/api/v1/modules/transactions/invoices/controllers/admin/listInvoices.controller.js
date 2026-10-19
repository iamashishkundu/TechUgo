const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listInvoicesService = require('../../services/listInvoices.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listInvoicesService(req.query);
  return success(res, { data });
});
