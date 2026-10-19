function success(res, { statusCode = 200, message = 'Success', data = null } = {}) {
  const responseBody = {
    success: true,
    message,
    data
  };
  return res.status(statusCode).json(responseBody);
}

function created(res, { message = 'Resource created successfully', data = null } = {}) {
  return success(res, { statusCode: 201, message, data });
}

module.exports = {
  success,
  created
};
