const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const getProfileController = require('../controllers/getProfile.controller');
const updateProfileController = require('../controllers/updateProfile.controller');
const changePasswordController = require('../controllers/changePassword.controller');

const updateProfileValidation = require('../validations/updateProfile.validation');
const changePasswordValidation = require('../validations/changePassword.validation');

router.get('/', authenticate(['admin']), getProfileController);
router.patch('/change-password', authenticate(['admin']), validate(changePasswordValidation), auditLogger({ module: 'admin', action: 'change_password', entityType: 'admin' }), changePasswordController);
router.patch('/', authenticate(['admin']), validate(updateProfileValidation), auditLogger({ module: 'admin', action: 'update_profile', entityType: 'admin' }), updateProfileController);

module.exports = router;
