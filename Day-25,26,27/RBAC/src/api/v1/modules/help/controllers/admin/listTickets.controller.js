const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listTicketsService = require('../../services/listTickets.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listTicketsService(req.query);
  return success(res, { data });
});
