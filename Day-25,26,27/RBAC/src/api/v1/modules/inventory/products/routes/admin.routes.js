const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');
const { uploadProductImages } = require('@middlewares/upload');

const listProductsController = require('../controllers/admin/listProducts.controller');
const createProductController = require('../controllers/admin/createProduct.controller');
const getProductController = require('../controllers/admin/getProduct.controller');
const updateProductController = require('../controllers/admin/updateProduct.controller');
const deleteProductController = require('../controllers/admin/deleteProduct.controller');
const addVariantController = require('../controllers/admin/addVariant.controller');
const updateVariantController = require('../controllers/admin/updateVariant.controller');
const deleteVariantController = require('../controllers/admin/deleteVariant.controller');
const uploadImagesController = require('../controllers/admin/uploadImages.controller');
const deleteImageController = require('../controllers/admin/deleteImage.controller');

const createProductValidation = require('../validations/admin/createProduct.validation');
const updateProductValidation = require('../validations/admin/updateProduct.validation');
const addVariantValidation = require('../validations/admin/addVariant.validation');
const updateVariantValidation = require('../validations/admin/updateVariant.validation');

router.get(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  listProductsController
);

router.post(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'create'),
  validate(createProductValidation),
  auditLogger({ module: 'inventory', action: 'create_product', entityType: 'product' }),
  createProductController
);

router.get(
  '/:productId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  getProductController
);

router.patch(
  '/:productId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  validate(updateProductValidation),
  auditLogger({ module: 'inventory', action: 'update_product', entityType: 'product' }),
  updateProductController
);

router.delete(
  '/:productId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'delete'),
  auditLogger({ module: 'inventory', action: 'delete_product', entityType: 'product' }),
  deleteProductController
);

// Variants
router.post(
  '/:productId/variants',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'create'),
  validate(addVariantValidation),
  auditLogger({ module: 'inventory', action: 'add_variant', entityType: 'product_variant' }),
  addVariantController
);

router.patch(
  '/:productId/variants/:variantId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  validate(updateVariantValidation),
  auditLogger({ module: 'inventory', action: 'update_variant', entityType: 'product_variant' }),
  updateVariantController
);

router.delete(
  '/:productId/variants/:variantId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'delete'),
  auditLogger({ module: 'inventory', action: 'delete_variant', entityType: 'product_variant' }),
  deleteVariantController
);

// Images
router.post(
  '/:productId/images',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  uploadProductImages,
  auditLogger({ module: 'inventory', action: 'upload_images', entityType: 'product' }),
  uploadImagesController
);

router.delete(
  '/:productId/images/:imageId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  auditLogger({ module: 'inventory', action: 'delete_image', entityType: 'product_image' }),
  deleteImageController
);

module.exports = router;
