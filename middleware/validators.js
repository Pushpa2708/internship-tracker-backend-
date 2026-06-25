const { body, validationResult } = require('express-validator');

// Runs after validator chains, short-circuits with 400 if anything failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,  // first error - clean single message
      errors: errors.array()            // full list - frontend uses this to highlight fields
    });
  }
  next();
};

// ── Auth validators ──────────────────────────────────────────────
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

// ── Application validators ───────────────────────────────────────
const applicationValidation = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),

  body('role')
    .trim()
    .notEmpty().withMessage('Role is required'),

  body('status')
    .optional()
    .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Status must be Applied, Interview, Offer, or Rejected'),

  body('notes')
    .optional()
    .trim()
];

const updateApplicationValidation = [
  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty'),

  body('role')
    .optional()
    .trim()
    .notEmpty().withMessage('Role cannot be empty'),

  body('status')
    .optional()
    .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Status must be Applied, Interview, Offer, or Rejected'),

  body('notes')
    .optional()
    .trim()
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  applicationValidation,
  updateApplicationValidation
};