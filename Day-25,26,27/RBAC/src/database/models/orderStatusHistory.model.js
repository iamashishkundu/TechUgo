module.exports = (sequelize, DataTypes) => {
  const OrderStatusHistory = sequelize.define(
    'OrderStatusHistory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      fromStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      toStatus: {
        type: DataTypes.STRING,
        allowNull: false
      },
      changedByType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      changedById: {
        type: DataTypes.UUID,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'order_status_history',
      timestamps: true,
      updatedAt: false
    }
  );

  return OrderStatusHistory;
};
