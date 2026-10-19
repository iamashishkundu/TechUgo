const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const walletReportService = require('../../services/walletReport.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await walletReportService(req.query);
  return success(res, { data });
});
