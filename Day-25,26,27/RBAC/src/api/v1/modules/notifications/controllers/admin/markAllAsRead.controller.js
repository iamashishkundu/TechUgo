const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const markAllAsReadService = require('../../services/markAllAsRead.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await markAllAsReadService({
    recipientType: 'admin',
    recipientId: req.auth.id
  });
  return success(res, {
    message: 'All notifications marked as read',
    data
  });
});
