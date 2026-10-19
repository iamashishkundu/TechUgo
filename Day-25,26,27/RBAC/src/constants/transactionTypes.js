const TRANSACTION_TYPES = {
  WALLET_TOPUP: 'wallet_topup',
  ORDER_PAYMENT: 'order_payment',
  REFUND: 'refund',
  ADMIN_ADJUSTMENT: 'admin_adjustment'
};

const TRANSACTION_DIRECTIONS = {
  CREDIT: 'credit',
  DEBIT: 'debit'
};

const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed'
};

const WALLET_SOURCES = {
  TOPUP: 'topup',
  ORDER_PAYMENT: 'order_payment',
  REFUND: 'refund',
  ADMIN_ADJUSTMENT: 'admin_adjustment'
};

module.exports = {
  TRANSACTION_TYPES,
  TRANSACTION_DIRECTIONS,
  TRANSACTION_STATUS,
  WALLET_SOURCES
};
