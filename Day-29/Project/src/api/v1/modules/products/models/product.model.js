import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../../config/database.js';

export class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Product title cannot be empty' },
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Product SKU must be unique' },
      validate: {
        notEmpty: { msg: 'SKU cannot be empty' },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Price must be a valid decimal number' },
        min: { args: [0], msg: 'Price cannot be negative' },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'Stock must be an integer' },
        min: { args: [0], msg: 'Stock cannot drop below zero' },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    indexes: [
      {
        unique: true,
        fields: ['sku'],
      },
      {
        fields: ['is_active'],
      },
    ],
  }
);

export default Product;
