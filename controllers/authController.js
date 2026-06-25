const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // No manual validation needed - express-validator caught bad input before this runs

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('Invalid credentials', 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new AppError('Invalid credentials', 401));

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };