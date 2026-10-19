const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const createTicketService = require('../../services/createTicket.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createTicketService({
    userId: req.auth.id,
    subject: req.body.subject,
    message: req.body.message,
    priority: req.body.priority,
    files: req.files
  });
  return success(res, {
    statusCode: 201,
    message: 'Support ticket created successfully',
    data
  });
});
