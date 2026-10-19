const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const setupTwoFactorController = require('../controllers/setupTwoFactor.controller');
const enableTwoFactorController = require('../controllers/enableTwoFactor.controller');
const disableTwoFactorController = require('../controllers/disableTwoFactor.controller');

const enableTwoFactorValidation = require('../validations/enableTwoFactor.validation');
const disableTwoFactorValidation = require('../validations/disableTwoFactor.validation');

router.post('/setup', authenticate(['subadmin']), auditLogger({ module: 'subadmin', action: '2fa_setup', entityType: 'subadmin' }), setupTwoFactorController);
router.post('/enable', authenticate(['subadmin']), validate(enableTwoFactorValidation), auditLogger({ module: 'subadmin', action: '2fa_enable', entityType: 'subadmin' }), enableTwoFactorController);
router.post('/disable', authenticate(['subadmin']), validate(disableTwoFactorValidation), auditLogger({ module: 'subadmin', action: '2fa_disable', entityType: 'subadmin' }), disableTwoFactorController);

module.exports = router;
