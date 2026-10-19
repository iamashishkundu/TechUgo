const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');

const listMyInvoicesController = require('../controllers/user/listMyInvoices.controller');
const getMyInvoiceController = require('../controllers/user/getMyInvoice.controller');

router.get('/invoices', authenticate('user'), listMyInvoicesController);
router.get('/invoices/:invoiceId', authenticate('user'), getMyInvoiceController);

module.exports = router;
