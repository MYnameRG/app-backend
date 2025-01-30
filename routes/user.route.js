const express = require('express');
const { signUpUser, logInUser } = require('../controllers/user.controller');
const { signup_validators, login_validators } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validation.middleware')

const router = express.Router();

router.post('/signup', signup_validators, validate, signUpUser);

router.post('/login', login_validators, validate, logInUser);

module.exports = router;