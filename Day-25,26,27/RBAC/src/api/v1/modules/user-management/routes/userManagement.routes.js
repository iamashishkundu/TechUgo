const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listUsersController = require('../controllers/listUsers.controller');
const getUserController = require('../controllers/getUser.controller');
const updateUserController = require('../controllers/updateUser.controller');
const blockUserController = require('../controllers/blockUser.controller');
const unblockUserController = require('../controllers/unblockUser.controller');
const deleteUserController = require('../controllers/deleteUser.controller');
const bulkActionController = require('../controllers/bulkAction.controller');

const updateUserValidation = require('../validations/updateUser.validation');
const blockUserValidation = require('../validations/blockUser.validation');
const bulkActionValidation = require('../validations/bulkAction.validation');

router.post(
  '/users/bulk-action',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', (req) => (req.body.action === 'delete' ? 'delete' : 'update')),
  validate(bulkActionValidation),
  bulkActionController
);

router.get(
  '/users',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'view'),
  listUsersController
);

router.get(
  '/users/:userId',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'view'),
  validate(blockUserValidation),
  getUserController
);

router.patch(
  '/users/:userId/block',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'update'),
  validate(blockUserValidation),
  auditLogger({ module: 'user_management', action: 'block', entityType: 'user' }),
  blockUserController
);

router.patch(
  '/users/:userId/unblock',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'update'),
  validate(blockUserValidation),
  auditLogger({ module: 'user_management', action: 'unblock', entityType: 'user' }),
  unblockUserController
);

router.patch(
  '/users/:userId',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'update'),
  validate(updateUserValidation),
  auditLogger({ module: 'user_management', action: 'update', entityType: 'user' }),
  updateUserController
);

router.delete(
  '/users/:userId',
  authenticate(['admin', 'subadmin']),
  authorize('user_management', 'delete'),
  validate(blockUserValidation),
  auditLogger({ module: 'user_management', action: 'delete', entityType: 'user' }),
  deleteUserController
);

module.exports = router;
