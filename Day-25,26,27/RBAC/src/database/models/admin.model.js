module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue('email', val ? val.toLowerCase().trim() : val);
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      twoFactorSecret: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'admins',
      paranoid: true
    }
  );

  return Admin;
};
