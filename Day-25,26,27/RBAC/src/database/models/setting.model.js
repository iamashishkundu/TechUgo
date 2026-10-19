module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    'Setting',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      value: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      group: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      updatedById: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'settings',
      paranoid: false
    }
  );

  return Setting;
};
