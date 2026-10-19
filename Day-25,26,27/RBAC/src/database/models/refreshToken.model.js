module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
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
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      familyId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      replacedById: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ['actor_type', 'actor_id']
        },
        {
          fields: ['family_id']
        }
      ]
    }
  );

  return RefreshToken;
};
