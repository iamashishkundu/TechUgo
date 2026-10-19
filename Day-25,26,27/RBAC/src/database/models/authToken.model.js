module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define(
    'AuthToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      actorType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      actorId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['email_verification', 'password_reset']]
        }
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'auth_tokens',
      timestamps: true,
      updatedAt: false
    }
  );

  return AuthToken;
};
