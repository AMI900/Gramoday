const ErrorResponse = require('../utils/errorResponse');

module.exports = (err, req, res, next) => {
  // For dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Invalid reportID`;
    err = new ErrorResponse(message, 400);
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || 'Server Error' });
};
