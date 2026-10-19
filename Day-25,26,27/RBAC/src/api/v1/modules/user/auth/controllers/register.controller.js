const asyncHandler = require('@utils/asyncHandler');
const { created } = require('@utils/apiResponse');
const registerService = require('../services/register.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await registerService(req.body);
  return created(res, { message: 'Registration successful. Please verify your email.', data });
});
