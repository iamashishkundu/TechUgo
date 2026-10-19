module.exports = (sequelize, DataTypes) => {
  const AdminPermission = sequelize.define(
    'AdminPermission',
    {
      adminId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      effect: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['allow', 'deny']]
        }
      }
    },
    {
      tableName: 'admin_permissions',
      timestamps: true,
      updatedAt: false
    }
  );

  return AdminPermission;
};
