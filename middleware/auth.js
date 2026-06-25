const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Not authorized - no token provided', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return next(new AppError('Not authorized - user no longer exists', 401));
    next();
  } catch (err) {
    next(err); // TokenExpiredError and JsonWebTokenError now handled by errorHandler
  }
};

module.exports = protect;