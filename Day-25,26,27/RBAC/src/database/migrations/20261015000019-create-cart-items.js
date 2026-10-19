module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      cart_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'carts',
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('cart_items', {
      type: 'check',
      fields: ['quantity'],
      where: {
        quantity: { [Sequelize.Op.gt]: 0 }
      },
      name: 'cart_items_quantity_positive'
    });

    await queryInterface.addIndex('cart_items', ['cart_id', 'variant_id'], {
      unique: true,
      name: 'cart_items_cart_variant_unique'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('cart_items');
  }
};
