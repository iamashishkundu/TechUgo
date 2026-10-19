module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      actor_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      actor_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      actor_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      before: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      after: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('audit_logs', ['module'], {
      name: 'audit_logs_module_idx'
    });
    await queryInterface.addIndex('audit_logs', ['actor_type', 'actor_id'], {
      name: 'audit_logs_actor_idx'
    });
    await queryInterface.addIndex('audit_logs', ['created_at'], {
      name: 'audit_logs_created_at_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  }
};
