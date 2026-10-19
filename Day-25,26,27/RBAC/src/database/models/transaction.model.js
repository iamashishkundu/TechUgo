module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      transactionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['wallet_topup', 'order_payment', 'refund', 'admin_adjustment']]
        }
      },
      direction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['credit', 'debit']]
        }
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('amount');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'success',
        validate: {
          isIn: [['success', 'failed']]
        }
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      walletEntryId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      tableName: 'transactions',
      timestamps: true,
      updatedAt: false
    }
  );

  return Transaction;
};
