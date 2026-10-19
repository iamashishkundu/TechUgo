const router = require('express').Router();
const validate = require('@middlewares/validate');
const { authenticate } = require('@middlewares/authenticate');
const { authLimiter } = require('@middlewares/rateLimiter');
const loginValidation = require('../validations/login.validation');
const loginController = require('../controllers/login.controller');
const refreshTokenValidation = require('../validations/refreshToken.validation');
const refreshTokenController = require('../controllers/refreshToken.controller');
const logoutController = require('../controllers/logout.controller');
const logoutAllController = require('../controllers/logoutAll.controller');

router.post('/login', authLimiter, validate(loginValidation), loginController);
router.post('/refresh-token', validate(refreshTokenValidation), refreshTokenController);
router.post('/logout', authenticate(['user']), logoutController);
router.post('/logout-all', authenticate(['user']), logoutAllController);

module.exports = router;
