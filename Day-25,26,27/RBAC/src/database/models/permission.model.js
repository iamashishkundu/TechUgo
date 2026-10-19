module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      moduleId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'permissions',
      paranoid: false,
      indexes: [
        {
          unique: true,
          fields: ['module_id', 'action']
        }
      ]
    }
  );

  return Permission;
};
