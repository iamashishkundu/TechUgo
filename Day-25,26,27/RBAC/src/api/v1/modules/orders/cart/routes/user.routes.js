const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const getCartController = require('../controllers/user/getCart.controller');
const clearCartController = require('../controllers/user/clearCart.controller');
const addCartItemController = require('../controllers/user/addCartItem.controller');
const updateCartItemController = require('../controllers/user/updateCartItem.controller');
const removeCartItemController = require('../controllers/user/removeCartItem.controller');

const addCartItemValidation = require('../validations/user/addCartItem.validation');
const updateCartItemValidation = require('../validations/user/updateCartItem.validation');

router.get('/cart', authenticate('user'), getCartController);
router.delete('/cart', authenticate('user'), clearCartController);
router.post(
  '/cart/items',
  authenticate('user'),
  validate(addCartItemValidation),
  addCartItemController
);
router.patch(
  '/cart/items/:itemId',
  authenticate('user'),
  validate(updateCartItemValidation),
  updateCartItemController
);
router.delete('/cart/items/:itemId', authenticate('user'), removeCartItemController);

module.exports = router;
