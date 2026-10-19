const router = require('express').Router();
const validate = require('@middlewares/validate');
const { authLimiter } = require('@middlewares/rateLimiter');
const verifyEmailValidation = require('../validations/verifyEmail.validation');
const verifyEmailController = require('../controllers/verifyEmail.controller');
const resendVerificationValidation = require('../validations/resendVerification.validation');
const resendVerificationController = require('../controllers/resendVerification.controller');

router.post('/verify-email', validate(verifyEmailValidation), verifyEmailController);
router.post('/resend-verification', authLimiter, validate(resendVerificationValidation), resendVerificationController);

module.exports = router;
