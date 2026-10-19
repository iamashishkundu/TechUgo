const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const listMyNotificationsController = require('../controllers/user/listMyNotifications.controller');
const getUnreadCountController = require('../controllers/user/getUnreadCount.controller');
const markAllAsReadController = require('../controllers/user/markAllAsRead.controller');
const markAsReadController = require('../controllers/user/markAsRead.controller');

const markAsReadValidation = require('../validations/user/markAsRead.validation');

router.get('/', authenticate('user'), listMyNotificationsController);
router.get('/unread-count', authenticate('user'), getUnreadCountController);
router.patch('/read-all', authenticate('user'), markAllAsReadController);
router.patch(
  '/:notificationId/read',
  authenticate('user'),
  validate(markAsReadValidation),
  markAsReadController
);

module.exports = router;
