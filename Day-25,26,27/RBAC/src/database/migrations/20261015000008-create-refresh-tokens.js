module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refresh_tokens', {
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
        allowNull: false
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      family_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      replaced_by_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('refresh_tokens', ['actor_type', 'actor_id'], {
      name: 'refresh_tokens_actor_idx'
    });
    await queryInterface.addIndex('refresh_tokens', ['family_id'], {
      name: 'refresh_tokens_family_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('refresh_tokens');
  }
};
