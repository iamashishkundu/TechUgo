const router = require('express').Router();
const validate = require('@middlewares/validate');
const { authenticate } = require('@middlewares/authenticate');
const { authLimiter } = require('@middlewares/rateLimiter');
const auditLogger = require('@middlewares/auditLogger');

const loginController = require('../controllers/login.controller');
const verifyTwoFactorLoginController = require('../controllers/verifyTwoFactorLogin.controller');
const refreshTokenController = require('../controllers/refreshToken.controller');
const logoutController = require('../controllers/logout.controller');
const logoutAllController = require('../controllers/logoutAll.controller');

const loginValidation = require('../validations/login.validation');
const verifyTwoFactorLoginValidation = require('../validations/verifyTwoFactorLogin.validation');
const refreshTokenValidation = require('../validations/refreshToken.validation');

router.post('/login', authLimiter, validate(loginValidation), auditLogger({ module: 'subadmin', action: 'login', entityType: 'subadmin' }), loginController);
router.post('/login/2fa', authLimiter, validate(verifyTwoFactorLoginValidation), auditLogger({ module: 'subadmin', action: 'login', entityType: 'subadmin' }), verifyTwoFactorLoginController);
router.post('/refresh-token', validate(refreshTokenValidation), refreshTokenController);
router.post('/logout', authenticate(['subadmin']), auditLogger({ module: 'subadmin', action: 'logout', entityType: 'subadmin' }), logoutController);
router.post('/logout-all', authenticate(['subadmin']), auditLogger({ module: 'subadmin', action: 'logout', entityType: 'subadmin' }), logoutAllController);

module.exports = router;
