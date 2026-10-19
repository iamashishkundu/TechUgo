module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallet_entries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      wallet_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      balance_after: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reference_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reference_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('wallet_entries', {
      type: 'check',
      fields: ['amount'],
      where: {
        amount: { [Sequelize.Op.gt]: 0 }
      },
      name: 'wallet_entries_amount_positive'
    });

    await queryInterface.addIndex('wallet_entries', ['wallet_id'], {
      name: 'wallet_entries_wallet_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('wallet_entries');
  }
};
