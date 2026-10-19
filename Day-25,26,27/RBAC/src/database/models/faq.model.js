module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define(
    'Faq',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'faqs',
      paranoid: false
    }
  );

  return Faq;
};
