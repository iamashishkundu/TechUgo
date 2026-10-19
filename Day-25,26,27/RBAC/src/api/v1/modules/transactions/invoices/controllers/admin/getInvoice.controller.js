const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getInvoiceService = require('../../services/getInvoice.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getInvoiceService({ invoiceId: req.params.invoiceId });
  return success(res, { data });
});
