const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const createFaqCategoryController = require('../controllers/admin/createFaqCategory.controller');
const listFaqCategoriesController = require('../controllers/admin/listFaqCategories.controller');
const updateFaqCategoryController = require('../controllers/admin/updateFaqCategory.controller');
const deleteFaqCategoryController = require('../controllers/admin/deleteFaqCategory.controller');

const createFaqCategoryValidation = require('../validations/admin/createFaqCategory.validation');
const updateFaqCategoryValidation = require('../validations/admin/updateFaqCategory.validation');

router.post('/', authenticate(['admin', 'subadmin']), authorize('faq', 'create'), validate(createFaqCategoryValidation), auditLogger({ module: 'faq', action: 'create_category', entityType: 'faq_category' }), createFaqCategoryController);
router.get('/', authenticate(['admin', 'subadmin']), authorize('faq', 'view'), listFaqCategoriesController);
router.patch('/:categoryId', authenticate(['admin', 'subadmin']), authorize('faq', 'update'), validate(updateFaqCategoryValidation), auditLogger({ module: 'faq', action: 'update_category', entityType: 'faq_category' }), updateFaqCategoryController);
router.delete('/:categoryId', authenticate(['admin', 'subadmin']), authorize('faq', 'delete'), auditLogger({ module: 'faq', action: 'delete_category', entityType: 'faq_category' }), deleteFaqCategoryController);

module.exports = router;
