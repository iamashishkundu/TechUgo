const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');

const listMyTransactionsController = require('../controllers/user/listMyTransactions.controller');
const getMyTransactionController = require('../controllers/user/getMyTransaction.controller');

router.get('/transactions', authenticate('user'), listMyTransactionsController);
router.get('/transactions/:transactionId', authenticate('user'), getMyTransactionController);

module.exports = router;
