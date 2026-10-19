module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      attributes: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      price: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      low_stock_threshold: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addConstraint('product_variants', {
      type: 'check',
      fields: ['stock'],
      where: {
        stock: { [Sequelize.Op.gte]: 0 }
      },
      name: 'product_variants_stock_non_negative'
    });

    await queryInterface.addIndex('product_variants', ['product_id'], {
      name: 'product_variants_product_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('product_variants');
  }
};
