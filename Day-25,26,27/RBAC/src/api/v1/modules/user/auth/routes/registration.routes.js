const router = require('express').Router();
const validate = require('@middlewares/validate');
const { authLimiter } = require('@middlewares/rateLimiter');
const registerValidation = require('../validations/register.validation');
const registerController = require('../controllers/register.controller');

router.post('/register', authLimiter, validate(registerValidation), registerController);

module.exports = router;
