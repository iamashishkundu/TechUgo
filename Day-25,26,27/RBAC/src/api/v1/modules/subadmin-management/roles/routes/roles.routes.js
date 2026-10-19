const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const createRoleController = require('../controllers/createRole.controller');
const listRolesController = require('../controllers/listRoles.controller');
const getRoleController = require('../controllers/getRole.controller');
const updateRoleController = require('../controllers/updateRole.controller');
const deleteRoleController = require('../controllers/deleteRole.controller');

const createRoleValidation = require('../validations/createRole.validation');
const updateRoleValidation = require('../validations/updateRole.validation');

router.post('/', authenticate(['admin']), validate(createRoleValidation), auditLogger({ module: 'subadmin_management', action: 'create_role', entityType: 'role' }), createRoleController);
router.get('/', authenticate(['admin']), listRolesController);
router.get('/:roleId', authenticate(['admin']), getRoleController);
router.patch('/:roleId', authenticate(['admin']), validate(updateRoleValidation), auditLogger({ module: 'subadmin_management', action: 'update_role', entityType: 'role' }), updateRoleController);
router.delete('/:roleId', authenticate(['admin']), auditLogger({ module: 'subadmin_management', action: 'delete_role', entityType: 'role' }), deleteRoleController);

module.exports = router;
