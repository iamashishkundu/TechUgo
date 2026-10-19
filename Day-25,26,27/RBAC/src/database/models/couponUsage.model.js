module.exports = (sequelize, DataTypes) => {
  const CouponUsage = sequelize.define(
    'CouponUsage',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      couponId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      tableName: 'coupon_usages',
      timestamps: true,
      updatedAt: false
    }
  );

  return CouponUsage;
};
