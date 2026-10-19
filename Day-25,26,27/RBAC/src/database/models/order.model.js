module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['paid', 'refunded']]
        }
      },
      subtotal: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('subtotal');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      discountAmount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        get() {
          const val = this.getDataValue('discountAmount');
          return val !== null && val !== undefined ? Number(val) : 0;
        }
      },
      total: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('total');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      couponId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      shippingAddress: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      placedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cancelReason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'orders',
      paranoid: false
    }
  );

  return Order;
};
