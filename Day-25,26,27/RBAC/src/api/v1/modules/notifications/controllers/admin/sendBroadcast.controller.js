const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const sendBroadcastService = require('../../services/sendBroadcast.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await sendBroadcastService(req.body);
  return success(res, {
    statusCode: 201,
    message: 'Broadcast notification sent successfully',
    data
  });
});
