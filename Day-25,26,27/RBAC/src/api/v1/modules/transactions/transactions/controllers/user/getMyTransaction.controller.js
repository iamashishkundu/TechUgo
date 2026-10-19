const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getMyTransactionService = require('../../services/getMyTransaction.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getMyTransactionService({
    userId: req.auth.id,
    transactionId: req.params.transactionId
  });
  return success(res, { data });
});
