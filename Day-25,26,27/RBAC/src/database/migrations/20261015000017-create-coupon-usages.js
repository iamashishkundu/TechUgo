module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupon_usages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      coupon_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('coupon_usages', ['coupon_id'], {
      name: 'coupon_usages_coupon_id_idx'
    });
    await queryInterface.addIndex('coupon_usages', ['user_id'], {
      name: 'coupon_usages_user_id_idx'
    });
    await queryInterface.addIndex('coupon_usages', ['order_id'], {
      name: 'coupon_usages_order_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('coupon_usages');
  }
};
