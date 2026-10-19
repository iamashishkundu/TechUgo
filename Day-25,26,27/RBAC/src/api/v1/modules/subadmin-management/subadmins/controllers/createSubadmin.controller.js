const asyncHandler = require('@utils/asyncHandler');
const { created } = require('@utils/apiResponse');
const createSubadminService = require('../services/createSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createSubadminService({
    ...req.body,
    createdById: req.auth.id
  });
  return created(res, { message: 'Subadmin created successfully', data });
});
