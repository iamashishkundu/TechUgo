const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');

const salesReportController = require('../controllers/admin/salesReport.controller');
const walletReportController = require('../controllers/admin/walletReport.controller');
const transactionReportController = require('../controllers/admin/transactionReport.controller');

const reportRangeValidation = require('../validations/admin/reportRange.validation');

router.get(
  '/reports/sales',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'export'),
  validate(reportRangeValidation),
  salesReportController
);

router.get(
  '/reports/wallet',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'export'),
  validate(reportRangeValidation),
  walletReportController
);

router.get(
  '/reports/transactions',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'export'),
  validate(reportRangeValidation),
  transactionReportController
);

module.exports = router;
