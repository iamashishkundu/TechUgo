const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listMyTransactionsService = require('../../services/listMyTransactions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listMyTransactionsService({
    userId: req.auth.id,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
