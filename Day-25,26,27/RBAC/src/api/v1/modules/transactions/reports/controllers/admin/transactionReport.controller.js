const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const transactionReportService = require('../../services/transactionReport.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await transactionReportService(req.query);
  return success(res, { data });
});
