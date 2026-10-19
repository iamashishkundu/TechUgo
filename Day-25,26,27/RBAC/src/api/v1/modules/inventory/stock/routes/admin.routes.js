const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const adjustStockController = require('../controllers/admin/adjustStock.controller');
const listStockMovementsController = require('../controllers/admin/listStockMovements.controller');
const listLowStockController = require('../controllers/admin/listLowStock.controller');
const updateLowStockThresholdController = require('../controllers/admin/updateLowStockThreshold.controller');

const adjustStockValidation = require('../validations/admin/adjustStock.validation');
const updateLowStockThresholdValidation = require('../validations/admin/updateLowStockThreshold.validation');

router.post(
  '/adjust',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  validate(adjustStockValidation),
  auditLogger({ module: 'inventory', action: 'adjust_stock', entityType: 'stock_movement' }),
  adjustStockController
);

router.get(
  '/movements',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  listStockMovementsController
);

router.get(
  '/low',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  listLowStockController
);

router.patch(
  '/variants/:variantId/threshold',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  validate(updateLowStockThresholdValidation),
  auditLogger({ module: 'inventory', action: 'update_low_stock_threshold', entityType: 'product_variant' }),
  updateLowStockThresholdController
);

module.exports = router;
