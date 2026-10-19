const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const env = require('../../config/env');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existing = await queryInterface.sequelize.query(
      "SELECT id FROM admins WHERE type = 'super_admin' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const email = env.SUPER_ADMIN_EMAIL.toLowerCase().trim();
    const passwordHash = bcrypt.hashSync(env.SUPER_ADMIN_PASSWORD, env.BCRYPT_ROUNDS);

    if (existing && existing.length > 0) {
      await queryInterface.bulkUpdate(
        'admins',
        {
          full_name: env.SUPER_ADMIN_NAME,
          email,
          phone: env.SUPER_ADMIN_PHONE,
          password_hash: passwordHash,
          status: 'active',
          updated_at: new Date()
        },
        { id: existing[0].id }
      );
    } else {
      await queryInterface.bulkInsert('admins', [
        {
          id: uuidv4(),
          type: 'super_admin',
          full_name: env.SUPER_ADMIN_NAME,
          email,
          phone: env.SUPER_ADMIN_PHONE,
          password_hash: passwordHash,
          avatar_url: null,
          status: 'active',
          role_id: null,
          two_factor_enabled: false,
          two_factor_secret: null,
          created_by_id: null,
          last_login_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('admins', { type: 'super_admin' }, {});
  }
};
