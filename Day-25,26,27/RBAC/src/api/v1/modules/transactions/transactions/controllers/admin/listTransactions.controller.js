const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listTransactionsService = require('../../services/listTransactions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listTransactionsService(req.query);
  return success(res, { data });
});
