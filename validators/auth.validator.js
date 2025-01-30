const { body } = require('express-validator');

const signup_validators = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const login_validators = [
  body('email').notEmpty().isEmail().withMessage('Invalid email format'),
  body('password').notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

module.exports = { signup_validators, login_validators };