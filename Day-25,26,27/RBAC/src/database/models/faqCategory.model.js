module.exports = (sequelize, DataTypes) => {
  const FaqCategory = sequelize.define(
    'FaqCategory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
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
      tableName: 'faq_categories',
      paranoid: false
    }
  );

  return FaqCategory;
};
