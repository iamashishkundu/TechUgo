module.exports = (sequelize, DataTypes) => {
  const WalletEntry = sequelize.define(
    'WalletEntry',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      walletId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['credit', 'debit']]
        }
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 1
        },
        get() {
          const val = this.getDataValue('amount');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      balanceAfter: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const val = this.getDataValue('balanceAfter');
          return val !== null && val !== undefined ? Number(val) : val;
        }
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['topup', 'order_payment', 'refund', 'admin_adjustment']]
        }
      },
      referenceType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referenceId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdByType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'wallet_entries',
      timestamps: true,
      updatedAt: false
    }
  );

  return WalletEntry;
};
