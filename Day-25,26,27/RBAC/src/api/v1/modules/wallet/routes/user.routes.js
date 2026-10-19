const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const getWalletController = require('../controllers/user/getWallet.controller');
const topUpWalletController = require('../controllers/user/topUpWallet.controller');
const listWalletEntriesController = require('../controllers/user/listWalletEntries.controller');

const topUpWalletValidation = require('../validations/user/topUpWallet.validation');

router.get('/wallet', authenticate('user'), getWalletController);
router.post(
  '/wallet/top-up',
  authenticate('user'),
  validate(topUpWalletValidation),
  topUpWalletController
);
router.get('/wallet/entries', authenticate('user'), listWalletEntriesController);

module.exports = router;
