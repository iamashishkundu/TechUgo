const { v4: uuidv4 } = require('uuid');

const defaultSettings = [
  {
    key: 'site.name',
    value: JSON.stringify('RBAC Commerce'),
    group: 'site',
    is_public: true,
    description: 'Name of the application'
  },
  {
    key: 'site.logoUrl',
    value: JSON.stringify('https://example.com/logo.png'),
    group: 'site',
    is_public: true,
    description: 'URL of the site logo'
  },
  {
    key: 'site.supportEmail',
    value: JSON.stringify('support@example.com'),
    group: 'site',
    is_public: true,
    description: 'Customer support email address'
  },
  {
    key: 'site.supportPhone',
    value: JSON.stringify('+91 9999999999'),
    group: 'site',
    is_public: true,
    description: 'Customer support phone number'
  },
  {
    key: 'site.maintenanceMode',
    value: JSON.stringify(false),
    group: 'site',
    is_public: true,
    description: 'Enable or disable maintenance mode'
  },
  {
    key: 'commerce.currency',
    value: JSON.stringify('INR'),
    group: 'commerce',
    is_public: true,
    description: 'Default commerce currency code'
  },
  {
    key: 'inventory.defaultLowStockThreshold',
    value: JSON.stringify(5),
    group: 'inventory',
    is_public: false,
    description: 'Default threshold for low stock alert'
  },
  {
    key: 'auth.allowRegistration',
    value: JSON.stringify(true),
    group: 'auth',
    is_public: true,
    description: 'Whether new customer registration is allowed'
  },
  {
    key: 'auth.requireEmailVerification',
    value: JSON.stringify(true),
    group: 'auth',
    is_public: false,
    description: 'Whether user email verification is required before login'
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existing = await queryInterface.sequelize.query(
      'SELECT key FROM settings',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingKeys = new Set(existing.map((s) => s.key));

    const toInsert = defaultSettings
      .filter((s) => !existingKeys.has(s.key))
      .map((s) => ({
        id: uuidv4(),
        key: s.key,
        value: s.value,
        group: s.group,
        is_public: s.is_public,
        description: s.description,
        updated_by_id: null,
        created_at: new Date(),
        updated_at: new Date()
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('settings', toInsert);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
