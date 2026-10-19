module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      transaction_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'success',
        allowNull: false
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      wallet_entry_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'wallet_entries',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('transactions', ['user_id'], {
      name: 'transactions_user_id_idx'
    });
    await queryInterface.addIndex('transactions', ['type'], {
      name: 'transactions_type_idx'
    });
    await queryInterface.addIndex('transactions', ['order_id'], {
      name: 'transactions_order_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('transactions');
  }
};
