module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      recipientType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['user', 'admin']]
        }
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'notifications',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ['recipient_type', 'recipient_id', 'is_read']
        }
      ]
    }
  );

  return Notification;
};
