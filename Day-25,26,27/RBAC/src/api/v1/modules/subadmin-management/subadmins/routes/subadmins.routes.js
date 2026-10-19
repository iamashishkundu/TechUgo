const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const createSubadminController = require('../controllers/createSubadmin.controller');
const listSubadminsController = require('../controllers/listSubadmins.controller');
const getSubadminController = require('../controllers/getSubadmin.controller');
const updateSubadminController = require('../controllers/updateSubadmin.controller');
const blockSubadminController = require('../controllers/blockSubadmin.controller');
const unblockSubadminController = require('../controllers/unblockSubadmin.controller');
const deleteSubadminController = require('../controllers/deleteSubadmin.controller');
const forceLogoutSubadminController = require('../controllers/forceLogoutSubadmin.controller');
const bulkActionController = require('../controllers/bulkAction.controller');

const createSubadminValidation = require('../validations/createSubadmin.validation');
const updateSubadminValidation = require('../validations/updateSubadmin.validation');
const blockSubadminValidation = require('../validations/blockSubadmin.validation');
const bulkActionValidation = require('../validations/bulkAction.validation');

const setDirectPermissionsController = require('../../permissions/controllers/setDirectPermissions.controller');
const assignRoleToSubadminController = require('../../permissions/controllers/assignRoleToSubadmin.controller');
const setDirectPermissionsValidation = require('../../permissions/validations/setDirectPermissions.validation');
const assignRoleToSubadminValidation = require('../../permissions/validations/assignRoleToSubadmin.validation');

router.post('/bulk-action', authenticate(['admin']), validate(bulkActionValidation), bulkActionController);

router.post('/', authenticate(['admin']), validate(createSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'create', entityType: 'subadmin' }), createSubadminController);
router.get('/', authenticate(['admin']), listSubadminsController);

router.get('/:subadminId', authenticate(['admin']), validate(blockSubadminValidation), getSubadminController);
router.patch('/:subadminId/block', authenticate(['admin']), validate(blockSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'block', entityType: 'subadmin' }), blockSubadminController);
router.patch('/:subadminId/unblock', authenticate(['admin']), validate(blockSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'unblock', entityType: 'subadmin' }), unblockSubadminController);
router.post('/:subadminId/force-logout', authenticate(['admin']), validate(blockSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'force_logout', entityType: 'subadmin' }), forceLogoutSubadminController);
router.patch('/:subadminId', authenticate(['admin']), validate(updateSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'update', entityType: 'subadmin' }), updateSubadminController);
router.put('/:subadminId/permissions', authenticate(['admin']), validate(setDirectPermissionsValidation), auditLogger({ module: 'subadmin_management', action: 'set_direct_permissions', entityType: 'subadmin' }), setDirectPermissionsController);
router.patch('/:subadminId/permissions', authenticate(['admin']), validate(setDirectPermissionsValidation), auditLogger({ module: 'subadmin_management', action: 'set_direct_permissions', entityType: 'subadmin' }), setDirectPermissionsController);
router.put('/:subadminId/role', authenticate(['admin']), validate(assignRoleToSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'assign_role', entityType: 'subadmin' }), assignRoleToSubadminController);
router.patch('/:subadminId/role', authenticate(['admin']), validate(assignRoleToSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'assign_role', entityType: 'subadmin' }), assignRoleToSubadminController);

router.delete('/:subadminId', authenticate(['admin']), validate(blockSubadminValidation), auditLogger({ module: 'subadmin_management', action: 'delete', entityType: 'subadmin' }), deleteSubadminController);

module.exports = router;
