const { v4: uuidv4 } = require('uuid');

const modulesData = [
  { key: 'user_management', name: 'User Management', description: 'Manage customer accounts' },
  { key: 'orders', name: 'Orders', description: 'Manage customer orders and coupons' },
  { key: 'transactions', name: 'Transactions', description: 'View financial transactions, invoices, and reports' },
  { key: 'wallet', name: 'Wallet', description: 'Manage customer digital wallets and adjustments' },
  { key: 'inventory', name: 'Inventory', description: 'Manage categories, products, variants, and stock' },
  { key: 'notifications', name: 'Notifications', description: 'Manage system announcements and alerts' },
  { key: 'faq', name: 'FAQ', description: 'Manage FAQ categories and questions' },
  { key: 'settings', name: 'Settings', description: 'Manage application configuration and maintenance' },
  { key: 'help', name: 'Help', description: 'Manage customer support help tickets' }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existing = await queryInterface.sequelize.query(
      'SELECT key FROM modules',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingKeys = new Set(existing.map((m) => m.key));

    const toInsert = modulesData
      .filter((m) => !existingKeys.has(m.key))
      .map((m) => ({
        id: uuidv4(),
        key: m.key,
        name: m.name,
        description: m.description,
        created_at: new Date(),
        updated_at: new Date()
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('modules', toInsert);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('modules', null, {});
  }
};
