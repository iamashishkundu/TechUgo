const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');

const listInvoicesController = require('../controllers/admin/listInvoices.controller');
const getInvoiceController = require('../controllers/admin/getInvoice.controller');

const listInvoicesValidation = require('../validations/admin/listInvoices.validation');

router.get(
  '/invoices',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'view'),
  validate(listInvoicesValidation),
  listInvoicesController
);

router.get(
  '/invoices/:invoiceId',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'view'),
  getInvoiceController
);

module.exports = router;
