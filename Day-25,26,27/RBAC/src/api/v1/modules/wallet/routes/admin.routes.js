const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listWalletsController = require('../controllers/admin/listWallets.controller');
const getWalletDetailController = require('../controllers/admin/getWalletDetail.controller');
const adjustWalletController = require('../controllers/admin/adjustWallet.controller');

const adjustWalletValidation = require('../validations/admin/adjustWallet.validation');

router.get(
  '/wallets',
  authenticate(['admin', 'subadmin']),
  authorize('wallet', 'view'),
  listWalletsController
);

router.get(
  '/wallets/:walletId',
  authenticate(['admin', 'subadmin']),
  authorize('wallet', 'view'),
  getWalletDetailController
);

router.post(
  '/wallets/:walletId/adjust',
  authenticate(['admin', 'subadmin']),
  authorize('wallet', 'update'),
  validate(adjustWalletValidation),
  auditLogger({ module: 'wallet', action: 'adjust_wallet', entityType: 'wallet' }),
  adjustWalletController
);

module.exports = router;
