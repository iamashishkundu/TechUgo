module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      ticketNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'open',
        validate: {
          isIn: [['open', 'in_progress', 'resolved', 'closed']]
        }
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: 'medium',
        validate: {
          isIn: [['low', 'medium', 'high']]
        }
      },
      lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'tickets',
      paranoid: false
    }
  );

  return Ticket;
};
