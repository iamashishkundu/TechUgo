module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define(
    'ProductVariant',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      attributes: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: true,
        get() {
          const val = this.getDataValue('price');
          return val !== null && val !== undefined ? Number(val) : null;
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      lowStockThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'product_variants',
      paranoid: true
    }
  );

  return ProductVariant;
};
