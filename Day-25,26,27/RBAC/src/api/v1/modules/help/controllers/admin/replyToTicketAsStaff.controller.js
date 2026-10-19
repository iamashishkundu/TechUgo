const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const replyToTicketAsStaffService = require('../../services/replyToTicketAsStaff.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await replyToTicketAsStaffService({
    adminId: req.auth.id,
    ticketId: req.params.ticketId,
    message: req.body.message,
    files: req.files
  });
  return success(res, {
    statusCode: 201,
    message: 'Reply posted successfully',
    data
  });
});
