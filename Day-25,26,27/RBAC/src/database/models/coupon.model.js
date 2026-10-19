module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    'Coupon',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val) {
          this.setDataValue('code', val ? val.toUpperCase().trim() : val);
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      discountType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['percent', 'fixed']]
        }
      },
      discountValue: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('discountValue');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      minOrderAmount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        get() {
          const val = this.getDataValue('minOrderAmount');
          return val !== null && val !== undefined ? Number(val) : 0;
        }
      },
      maxDiscountAmount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        get() {
          const val = this.getDataValue('maxDiscountAmount');
          return val !== null && val !== undefined ? Number(val) : null;
        }
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      perUserLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      startsAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'coupons',
      paranoid: true
    }
  );

  return Coupon;
};
