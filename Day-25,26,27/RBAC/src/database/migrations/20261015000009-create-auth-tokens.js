module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auth_tokens', {
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
      purpose: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('auth_tokens', ['actor_type', 'actor_id', 'purpose'], {
      name: 'auth_tokens_actor_purpose_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('auth_tokens');
  }
};
