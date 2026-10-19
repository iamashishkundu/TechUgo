const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getTransactionService = require('../../services/getTransaction.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getTransactionService({ transactionId: req.params.transactionId });
  return success(res, { data });
});
