const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const salesReportService = require('../../services/salesReport.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await salesReportService(req.query);
  return success(res, { data });
});
