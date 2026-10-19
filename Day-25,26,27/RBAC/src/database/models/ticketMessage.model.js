module.exports = (sequelize, DataTypes) => {
  const TicketMessage = sequelize.define(
    'TicketMessage',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      ticketId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      senderType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['user', 'admin']]
        }
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      attachments: {
        type: DataTypes.JSONB,
        defaultValue: []
      }
    },
    {
      tableName: 'ticket_messages',
      timestamps: true,
      updatedAt: false
    }
  );

  return TicketMessage;
};
