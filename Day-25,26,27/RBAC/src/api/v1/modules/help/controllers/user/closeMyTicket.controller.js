const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const closeMyTicketService = require('../../services/closeMyTicket.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await closeMyTicketService({
    userId: req.auth.id,
    ticketId: req.params.ticketId
  });
  return success(res, {
    message: 'Ticket closed successfully',
    data
  });
});
