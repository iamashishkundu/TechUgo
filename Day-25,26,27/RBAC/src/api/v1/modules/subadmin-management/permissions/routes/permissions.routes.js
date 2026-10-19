const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listModulesAndActionsController = require('../controllers/listModulesAndActions.controller');
const assignRoleToSubadminController = require('../controllers/assignRoleToSubadmin.controller');
const setDirectPermissionsController = require('../controllers/setDirectPermissions.controller');
const getEffectivePermissionsController = require('../controllers/getEffectivePermissions.controller');

const assignRoleToSubadminValidation = require('../validations/assignRoleToSubadmin.validation');
const setDirectPermissionsValidation = require('../validations/setDirectPermissions.validation');

router.get('/', authenticate(['admin']), listModulesAndActionsController);
router.get('/modules', authenticate(['admin']), listModulesAndActionsController);
router.put('/subadmins/:subadminId/role', authenticate(['admin']), validate(assignRoleToSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'assign_role', entityType: 'subadmin' }), assignRoleToSubadminController);
router.put('/subadmins/:subadminId/permissions', authenticate(['admin']), validate(setDirectPermissionsValidation), auditLogger({ module: 'subadmin_management', action: 'set_direct_permissions', entityType: 'subadmin' }), setDirectPermissionsController);
router.get('/subadmins/:subadminId/effective', authenticate(['admin']), getEffectivePermissionsController);

module.exports = router;
