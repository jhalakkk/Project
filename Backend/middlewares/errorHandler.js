// Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);  // Pass the error to the error handler
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Set status code based on the error or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Check if the environment is production or development for stack visibility
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      status: 'fail',
      message: err?.message || 'An unexpected error occurred',
    });
  } else {
    // In development, include the error stack for debugging purposes
    res.status(statusCode).json({
      status: 'fail',
      message: err?.message || 'An unexpected error occurred',
      stack: err?.stack,
    });
  }
};

module.exports = { notFound, errorHandler };
