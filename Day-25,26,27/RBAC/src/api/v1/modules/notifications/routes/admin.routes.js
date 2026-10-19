const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listNotificationsController = require('../controllers/admin/listNotifications.controller');
const markAllAsReadController = require('../controllers/admin/markAllAsRead.controller');
const markAsReadController = require('../controllers/admin/markAsRead.controller');
const sendBroadcastController = require('../controllers/admin/sendBroadcast.controller');

const sendBroadcastValidation = require('../validations/admin/sendBroadcast.validation');
const markAsReadValidation = require('../validations/admin/markAsRead.validation');

router.get(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('notifications', 'view'),
  listNotificationsController
);

router.post(
  '/broadcast',
  authenticate(['admin', 'subadmin']),
  authorize('notifications', 'create'),
  validate(sendBroadcastValidation),
  auditLogger({ module: 'notifications', action: 'send_broadcast', entityType: 'notification' }),
  sendBroadcastController
);

router.patch(
  '/read-all',
  authenticate(['admin', 'subadmin']),
  authorize('notifications', 'view'),
  markAllAsReadController
);

router.patch(
  '/:notificationId/read',
  authenticate(['admin', 'subadmin']),
  authorize('notifications', 'view'),
  validate(markAsReadValidation),
  markAsReadController
);

module.exports = router;
