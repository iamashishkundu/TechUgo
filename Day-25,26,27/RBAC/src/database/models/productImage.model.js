module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
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
      variantId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'product_images',
      paranoid: false
    }
  );

  return ProductImage;
};
