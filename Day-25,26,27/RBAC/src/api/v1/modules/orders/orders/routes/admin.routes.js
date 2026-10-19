const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listOrdersController = require('../controllers/admin/listOrders.controller');
const getOrderController = require('../controllers/admin/getOrder.controller');
const updateOrderStatusController = require('../controllers/admin/updateOrderStatus.controller');

const updateOrderStatusValidation = require('../validations/admin/updateOrderStatus.validation');

router.get(
  '/orders',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'view'),
  listOrdersController
);

router.get(
  '/orders/:orderId',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'view'),
  getOrderController
);

router.patch(
  '/orders/:orderId/status',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'update'),
  validate(updateOrderStatusValidation),
  auditLogger({ module: 'orders', action: 'update_status', entityType: 'order' }),
  updateOrderStatusController
);

module.exports = router;
