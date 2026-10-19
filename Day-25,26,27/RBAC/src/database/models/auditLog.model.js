module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    'AuditLog',
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
        allowNull: true
      },
      actorName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      before: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      after: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ['module']
        },
        {
          fields: ['actor_type', 'actor_id']
        },
        {
          fields: ['created_at']
        }
      ]
    }
  );

  return AuditLog;
};
