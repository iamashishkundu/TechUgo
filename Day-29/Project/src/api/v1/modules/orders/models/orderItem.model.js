import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../../config/database.js';

export class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Quantity must be an integer' },
        min: { args: [1], msg: 'Quantity must be at least 1' },
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
      validate: {
        isDecimal: { msg: 'Unit price must be a valid decimal' },
        min: { args: [0], msg: 'Unit price cannot be negative' },
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Subtotal must be a valid decimal' },
        min: { args: [0], msg: 'Subtotal cannot be negative' },
      },
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    indexes: [
      {
        fields: ['order_id'],
      },
      {
        fields: ['product_id'],
      },
    ],
  }
);

export default OrderItem;
