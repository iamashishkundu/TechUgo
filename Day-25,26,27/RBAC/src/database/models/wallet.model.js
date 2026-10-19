module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    'Wallet',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      balance: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        validate: {
          min: 0
        },
        get() {
          const val = this.getDataValue('balance');
          return val !== null && val !== undefined ? Number(val) : 0;
        }
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
      }
    },
    {
      tableName: 'wallets',
      paranoid: false
    }
  );

  return Wallet;
};
