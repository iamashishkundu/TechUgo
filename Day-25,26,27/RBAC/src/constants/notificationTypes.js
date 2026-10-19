const NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  ORDER_PLACED: 'order_placed',
  WALLET_CREDIT: 'wallet_credit',
  WALLET_DEBIT: 'wallet_debit',
  LOW_STOCK: 'low_stock',
  TICKET_REPLY: 'ticket_reply',
  TICKET_STATUS: 'ticket_status',
  BROADCAST: 'broadcast',
  SYSTEM: 'system'
};

const NOTIFICATION_RECIPIENT_TYPES = {
  USER: 'user',
  ADMIN: 'admin'
};

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_RECIPIENT_TYPES
};
