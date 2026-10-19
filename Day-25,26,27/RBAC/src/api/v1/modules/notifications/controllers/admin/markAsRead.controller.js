const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const markAsReadService = require('../../services/markAsRead.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await markAsReadService({
    recipientType: 'admin',
    recipientId: req.auth.id,
    notificationId: req.params.notificationId
  });
  return success(res, {
    message: 'Notification marked as read',
    data
  });
});
