const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateTicketStatusService = require('../../services/updateTicketStatus.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateTicketStatusService({
    ticketId: req.params.ticketId,
    status: req.body.status
  });
  return success(res, {
    message: 'Ticket status updated successfully',
    data
  });
});
