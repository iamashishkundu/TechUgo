module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
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
      variantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      variantSku: {
        type: DataTypes.STRING,
        allowNull: false
      },
      variantAttributes: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      unitPrice: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('unitPrice');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lineTotal: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('lineTotal');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      }
    },
    {
      tableName: 'order_items',
      paranoid: false
    }
  );

  return OrderItem;
};
