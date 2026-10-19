const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const bulkActionService = require('../services/bulkAction.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await bulkActionService({
    ids: req.body.ids,
    action: req.body.action,
    adminUser: req.actor,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent']
  });
  return success(res, { message: 'Bulk action completed', data });
});
