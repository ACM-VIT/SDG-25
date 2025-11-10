exports.successResponse = (
  res,
  data = {},
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (
  res,
  message = "Something went wrong",
  status = 500,
  error = null
) => {
  return res.status(status).json({
    success: false,
    message,
    error: error ? error.toString() : undefined,
  });
};
