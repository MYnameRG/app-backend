const express = require('express');
const { signup_validators, login_validators } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validation.middleware');
const UserController = require('../controllers/user.controller');

const router = express.Router();
const UserServiceController = new UserController();

router.post('/signup', signup_validators, validate, UserServiceController.signUpUser);

router.post('/login', login_validators, validate, UserServiceController.logInUser);

module.exports = router;