// Error handler middleware

const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (error.message === 'Missing Content-Type') {
    error = new ErrorResponse('Expected multipart/form-data upload', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};
