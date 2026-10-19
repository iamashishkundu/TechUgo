const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');

const listTransactionsController = require('../controllers/admin/listTransactions.controller');
const getTransactionController = require('../controllers/admin/getTransaction.controller');

const listTransactionsValidation = require('../validations/admin/listTransactions.validation');

router.get(
  '/transactions',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'view'),
  validate(listTransactionsValidation),
  listTransactionsController
);

router.get(
  '/transactions/:transactionId',
  authenticate(['admin', 'subadmin']),
  authorize('transactions', 'view'),
  getTransactionController
);

module.exports = router;
