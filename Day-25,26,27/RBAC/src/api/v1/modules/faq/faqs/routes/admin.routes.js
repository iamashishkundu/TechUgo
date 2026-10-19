const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listFaqsController = require('../controllers/admin/listFaqs.controller');
const createFaqController = require('../controllers/admin/createFaq.controller');
const updateFaqController = require('../controllers/admin/updateFaq.controller');
const deleteFaqController = require('../controllers/admin/deleteFaq.controller');
const toggleFaqStatusController = require('../controllers/admin/toggleFaqStatus.controller');
const reorderFaqsController = require('../controllers/admin/reorderFaqs.controller');

const createFaqValidation = require('../validations/admin/createFaq.validation');
const updateFaqValidation = require('../validations/admin/updateFaq.validation');
const reorderFaqsValidation = require('../validations/admin/reorderFaqs.validation');

router.get(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'view'),
  listFaqsController
);

router.post(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'create'),
  validate(createFaqValidation),
  auditLogger({ module: 'faq', action: 'create', entityType: 'faq' }),
  createFaqController
);

router.put(
  '/reorder',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'update'),
  validate(reorderFaqsValidation),
  auditLogger({ module: 'faq', action: 'reorder', entityType: 'faq' }),
  reorderFaqsController
);

router.patch(
  '/:faqId/status',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'update'),
  auditLogger({ module: 'faq', action: 'toggle_status', entityType: 'faq' }),
  toggleFaqStatusController
);

router.patch(
  '/:faqId',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'update'),
  validate(updateFaqValidation),
  auditLogger({ module: 'faq', action: 'update', entityType: 'faq' }),
  updateFaqController
);

router.delete(
  '/:faqId',
  authenticate(['admin', 'subadmin']),
  authorize('faq', 'delete'),
  auditLogger({ module: 'faq', action: 'delete', entityType: 'faq' }),
  deleteFaqController
);

module.exports = router;
