const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getUnreadCountService = require('../../services/getUnreadCount.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getUnreadCountService({
    recipientType: 'user',
    recipientId: req.auth.id
  });
  return success(res, { data });
});
