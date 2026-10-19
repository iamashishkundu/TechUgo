const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const setupTwoFactorController = require('../controllers/setupTwoFactor.controller');
const enableTwoFactorController = require('../controllers/enableTwoFactor.controller');
const disableTwoFactorController = require('../controllers/disableTwoFactor.controller');

const enableTwoFactorValidation = require('../validations/enableTwoFactor.validation');
const disableTwoFactorValidation = require('../validations/disableTwoFactor.validation');

router.post('/setup', authenticate(['admin']), auditLogger({ module: 'admin', action: '2fa_setup', entityType: 'admin' }), setupTwoFactorController);
router.post('/enable', authenticate(['admin']), validate(enableTwoFactorValidation), auditLogger({ module: 'admin', action: '2fa_enable', entityType: 'admin' }), enableTwoFactorController);
router.post('/disable', authenticate(['admin']), validate(disableTwoFactorValidation), auditLogger({ module: 'admin', action: '2fa_disable', entityType: 'admin' }), disableTwoFactorController);

module.exports = router;
