const router = require('express').Router();
const listActiveProductsController = require('../controllers/user/listActiveProducts.controller');
const getActiveProductController = require('../controllers/user/getActiveProduct.controller');

// Public catalog routes for products
router.get('/', listActiveProductsController);
router.get('/:productId', getActiveProductController);

module.exports = router;
