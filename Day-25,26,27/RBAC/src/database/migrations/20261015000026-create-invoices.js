module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      subtotal: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      total: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      issued_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      snapshot: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('invoices', ['user_id'], {
      name: 'invoices_user_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('invoices');
  }
};
