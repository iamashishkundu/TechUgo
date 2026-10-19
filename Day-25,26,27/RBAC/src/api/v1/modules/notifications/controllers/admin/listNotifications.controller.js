const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listNotificationsService = require('../../services/listNotifications.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listNotificationsService({
    adminId: req.auth.id,
    isRead: req.query.isRead,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
