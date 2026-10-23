import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../../config/database.js';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
};

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
};

export class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
      validate: {
        isDecimal: { msg: 'Total amount must be a decimal value' },
        min: { args: [0], msg: 'Total amount cannot be negative' },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.UNPAID,
      allowNull: false,
      field: 'payment_status',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Order;
