module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      roleId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      }
    },
    {
      tableName: 'role_permissions',
      timestamps: false
    }
  );

  return RolePermission;
};
