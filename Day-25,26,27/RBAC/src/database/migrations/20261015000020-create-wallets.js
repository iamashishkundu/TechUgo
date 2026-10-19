module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      balance: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'INR',
        allowNull: false
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

    await queryInterface.addConstraint('wallets', {
      type: 'check',
      fields: ['balance'],
      where: {
        balance: { [Sequelize.Op.gte]: 0 }
      },
      name: 'wallets_balance_non_negative'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('wallets');
  }
};
