module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_items', {
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
      variant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'product_variants',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      variant_sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      variant_attributes: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      unit_price: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      line_total: {
        type: Sequelize.BIGINT,
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

    await queryInterface.addIndex('order_items', ['order_id'], {
      name: 'order_items_order_id_idx'
    });
    await queryInterface.addIndex('order_items', ['variant_id'], {
      name: 'order_items_variant_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('order_items');
  }
};
