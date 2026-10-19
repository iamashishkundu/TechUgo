module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_status_history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      from_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      to_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      changed_by_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      changed_by_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('order_status_history', ['order_id'], {
      name: 'order_status_history_order_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('order_status_history');
  }
};
