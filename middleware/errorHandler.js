const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // MongoDB duplicate key (unique index violated)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email already registered';
  }

  // JWT signature invalid or malformed
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized - invalid token';
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please login again';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // only show stack trace in development, never in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;