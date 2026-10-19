const MODULES = {
  USER_MANAGEMENT: 'user_management',
  ORDERS: 'orders',
  TRANSACTIONS: 'transactions',
  WALLET: 'wallet',
  INVENTORY: 'inventory',
  NOTIFICATIONS: 'notifications',
  FAQ: 'faq',
  SETTINGS: 'settings',
  HELP: 'help'
};

const MODULE_LABELS = {
  [MODULES.USER_MANAGEMENT]: 'User Management',
  [MODULES.ORDERS]: 'Orders',
  [MODULES.TRANSACTIONS]: 'Transactions',
  [MODULES.WALLET]: 'Wallet',
  [MODULES.INVENTORY]: 'Inventory',
  [MODULES.NOTIFICATIONS]: 'Notifications',
  [MODULES.FAQ]: 'FAQ',
  [MODULES.SETTINGS]: 'Settings',
  [MODULES.HELP]: 'Help & Support'
};

const MODULE_LIST = Object.values(MODULES);

module.exports = {
  MODULES,
  MODULE_LABELS,
  MODULE_LIST
};
