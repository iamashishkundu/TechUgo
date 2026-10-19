module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      order_number: {
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
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
      },
      total: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      coupon_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      shipping_address: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      placed_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancel_reason: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('orders', ['user_id'], {
      name: 'orders_user_id_idx'
    });
    await queryInterface.addIndex('orders', ['status'], {
      name: 'orders_status_idx'
    });

    // Add foreign key constraint to coupon_usages
    await queryInterface.addConstraint('coupon_usages', {
      type: 'foreign key',
      fields: ['order_id'],
      name: 'coupon_usages_order_id_fk',
      references: {
        table: 'orders',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('coupon_usages', 'coupon_usages_order_id_fk');
    await queryInterface.dropTable('orders');
  }
};
