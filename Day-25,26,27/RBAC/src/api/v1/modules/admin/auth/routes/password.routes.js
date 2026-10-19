const router = require('express').Router();
const validate = require('@middlewares/validate');
const { authLimiter } = require('@middlewares/rateLimiter');
const forgotPasswordValidation = require('../validations/forgotPassword.validation');
const forgotPasswordController = require('../controllers/forgotPassword.controller');
const resetPasswordValidation = require('../validations/resetPassword.validation');
const resetPasswordController = require('../controllers/resetPassword.controller');

router.post('/forgot-password', authLimiter, validate(forgotPasswordValidation), forgotPasswordController);
router.post('/reset-password', authLimiter, validate(resetPasswordValidation), resetPasswordController);

module.exports = router;
