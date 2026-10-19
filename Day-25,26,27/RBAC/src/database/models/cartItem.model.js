module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      variantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      }
    },
    {
      tableName: 'cart_items',
      paranoid: false,
      indexes: [
        {
          unique: true,
          fields: ['cart_id', 'variant_id']
        }
      ]
    }
  );

  return CartItem;
};
