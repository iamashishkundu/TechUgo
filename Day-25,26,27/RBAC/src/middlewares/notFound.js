const { ERROR_CODES, MESSAGES } = require('@constants/messages');

function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: MESSAGES.ROUTE_NOT_FOUND,
    code: ERROR_CODES.ROUTE_NOT_FOUND
  });
}

module.exports = notFound;
