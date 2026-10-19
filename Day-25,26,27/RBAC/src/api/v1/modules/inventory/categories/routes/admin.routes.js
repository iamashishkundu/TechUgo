const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listCategoriesController = require('../controllers/admin/listCategories.controller');
const createCategoryController = require('../controllers/admin/createCategory.controller');
const getCategoryController = require('../controllers/admin/getCategory.controller');
const updateCategoryController = require('../controllers/admin/updateCategory.controller');
const deleteCategoryController = require('../controllers/admin/deleteCategory.controller');

const createCategoryValidation = require('../validations/admin/createCategory.validation');
const updateCategoryValidation = require('../validations/admin/updateCategory.validation');

router.get(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  listCategoriesController
);

router.post(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'create'),
  validate(createCategoryValidation),
  auditLogger({ module: 'inventory', action: 'create_category', entityType: 'category' }),
  createCategoryController
);

router.get(
  '/:categoryId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'view'),
  getCategoryController
);

router.patch(
  '/:categoryId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'update'),
  validate(updateCategoryValidation),
  auditLogger({ module: 'inventory', action: 'update_category', entityType: 'category' }),
  updateCategoryController
);

router.delete(
  '/:categoryId',
  authenticate(['admin', 'subadmin']),
  authorize('inventory', 'delete'),
  auditLogger({ module: 'inventory', action: 'delete_category', entityType: 'category' }),
  deleteCategoryController
);

module.exports = router;
