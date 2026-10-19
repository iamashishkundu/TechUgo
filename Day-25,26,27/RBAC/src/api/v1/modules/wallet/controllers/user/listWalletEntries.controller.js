const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listWalletEntriesService = require('../../services/listWalletEntries.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listWalletEntriesService({
    userId: req.auth.id,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
