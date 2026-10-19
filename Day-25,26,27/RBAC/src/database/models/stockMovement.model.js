module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define(
    'StockMovement',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      variantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['initial', 'order', 'cancellation', 'return', 'adjustment']]
        }
      },
      quantityChange: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stockAfter: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      referenceType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referenceId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdByType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'stock_movements',
      timestamps: true,
      updatedAt: false
    }
  );

  return StockMovement;
};
