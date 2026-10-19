const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const getProfileController = require('../controllers/getProfile.controller');
const updateProfileController = require('../controllers/updateProfile.controller');
const changePasswordController = require('../controllers/changePassword.controller');
const getMyPermissionsController = require('../controllers/getMyPermissions.controller');

const updateProfileValidation = require('../validations/updateProfile.validation');
const changePasswordValidation = require('../validations/changePassword.validation');

router.get('/permissions', authenticate(['subadmin']), getMyPermissionsController);
router.patch('/change-password', authenticate(['subadmin']), validate(changePasswordValidation), auditLogger({ module: 'subadmin', action: 'change_password', entityType: 'subadmin' }), changePasswordController);
router.get('/', authenticate(['subadmin']), getProfileController);
router.patch('/', authenticate(['subadmin']), validate(updateProfileValidation), auditLogger({ module: 'subadmin', action: 'update_profile', entityType: 'subadmin' }), updateProfileController);

module.exports = router;
