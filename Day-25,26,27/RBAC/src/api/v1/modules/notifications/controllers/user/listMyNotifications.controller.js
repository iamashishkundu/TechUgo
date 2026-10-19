const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listMyNotificationsService = require('../../services/listMyNotifications.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listMyNotificationsService({
    userId: req.auth.id,
    isRead: req.query.isRead,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
