module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      ticket_number: {
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
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'open',
        allowNull: false
      },
      priority: {
        type: Sequelize.STRING,
        defaultValue: 'medium',
        allowNull: false
      },
      last_message_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('tickets', ['user_id'], {
      name: 'tickets_user_id_idx'
    });
    await queryInterface.addIndex('tickets', ['status'], {
      name: 'tickets_status_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tickets');
  }
};
