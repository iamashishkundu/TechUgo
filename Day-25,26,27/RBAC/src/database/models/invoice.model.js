module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
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
        allowNull: false,
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
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      snapshot: {
        type: DataTypes.JSONB,
        allowNull: false
      }
    },
    {
      tableName: 'invoices',
      timestamps: true,
      updatedAt: false
    }
  );

  return Invoice;
};
