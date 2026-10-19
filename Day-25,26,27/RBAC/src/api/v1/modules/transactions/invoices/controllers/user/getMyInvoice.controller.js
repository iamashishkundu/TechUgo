const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getMyInvoiceService = require('../../services/getMyInvoice.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getMyInvoiceService({
    userId: req.auth.id,
    invoiceId: req.params.invoiceId
  });
  return success(res, { data });
});
