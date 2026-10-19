const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listMyInvoicesService = require('../../services/listMyInvoices.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listMyInvoicesService({
    userId: req.auth.id,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
