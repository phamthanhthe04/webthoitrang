const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log error
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
