function sendErrorJson(res, message, statusCode) {
  res.status(statusCode).json({
    status: statusCode.toString().startsWith('4') ? 'fail' : 'error',
    data: { message },
  });
}

module.exports = sendErrorJson;
