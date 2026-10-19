const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getMyTicketService = require('../../services/getMyTicket.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getMyTicketService({
    userId: req.auth.id,
    ticketId: req.params.ticketId
  });
  return success(res, { data });
});
