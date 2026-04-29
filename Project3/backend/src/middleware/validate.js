/**
 * Input validation middleware using express-validator.
 * Provides reusable validation chains for each endpoint group.
 */

const { body, validationResult } = require('express-validator');

/**
 * Runs after a validation chain and returns 422 if errors exist.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation rules for student registration.
 */
const validateRegistration = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 100 }).withMessage('First name must be under 100 characters'),

  body('middle_name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Middle name must be under 100 characters'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 100 }).withMessage('Last name must be under 100 characters'),

  body('student_id')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .isLength({ max: 20 }).withMessage('Student ID must be under 20 characters'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('event_id')
    .notEmpty().withMessage('Event ID is required')
    .isInt({ min: 1 }).withMessage('Event ID must be a positive integer'),

  handleValidationErrors,
];

/**
 * Validation rules for event creation.
 */
const validateEvent = [
  body('name')
    .trim()
    .notEmpty().withMessage('Event name is required')
    .isLength({ max: 255 }).withMessage('Event name must be under 255 characters'),

  body('description')
    .optional()
    .trim(),

  body('event_date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Event date must be a valid ISO 8601 date'),

  body('cost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cost must be a non-negative number'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  handleValidationErrors,
];

/**
 * Validation rules for route calculation.
 */
const validateRouteCalc = [
  body('student_address')
    .trim()
    .notEmpty().withMessage('Student address is required'),

  body('event_location')
    .trim()
    .notEmpty().withMessage('Event location is required'),

  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateEvent,
  validateRouteCalc,
  handleValidationErrors,
};
