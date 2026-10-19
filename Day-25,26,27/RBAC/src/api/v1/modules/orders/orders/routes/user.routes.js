const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const placeOrderController = require('../controllers/user/placeOrder.controller');
const listMyOrdersController = require('../controllers/user/listMyOrders.controller');
const getMyOrderController = require('../controllers/user/getMyOrder.controller');
const cancelOrderController = require('../controllers/user/cancelOrder.controller');

const placeOrderValidation = require('../validations/user/placeOrder.validation');

router.post(
  '/orders',
  authenticate('user'),
  validate(placeOrderValidation),
  placeOrderController
);
router.get('/orders', authenticate('user'), listMyOrdersController);
router.get('/orders/:orderId', authenticate('user'), getMyOrderController);
router.post('/orders/:orderId/cancel', authenticate('user'), cancelOrderController);

module.exports = router;
