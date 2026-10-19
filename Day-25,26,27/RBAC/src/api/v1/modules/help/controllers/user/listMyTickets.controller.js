const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listMyTicketsService = require('../../services/listMyTickets.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listMyTicketsService({
    userId: req.auth.id,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
