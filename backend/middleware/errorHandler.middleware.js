const { errorResponse } = require("../utils/response");

exports.errorHandler = (err, req, res, next) => {
  console.error("Global Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, message, statusCode, err);
};
