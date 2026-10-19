module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_movements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity_change: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      stock_after: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('stock_movements', ['variant_id'], {
      name: 'stock_movements_variant_id_idx'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stock_movements');
  }
};
