module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      discount_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discount_value: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      min_order_amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
      },
      max_discount_amount: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      per_user_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      used_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      starts_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('coupons');
  }
};
