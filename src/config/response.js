const successResponse = (res, statusCode, msg, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message: msg,
    data,
  });
};

const errorResponse = (res, statusCode, msg, error = null) => {
  return res.status(statusCode).json({
    status: "error",
    message: msg,
    error,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
