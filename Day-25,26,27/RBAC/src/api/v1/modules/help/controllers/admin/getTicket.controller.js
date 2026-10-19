const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getTicketService = require('../../services/getTicket.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getTicketService({ ticketId: req.params.ticketId });
  return success(res, { data });
});
