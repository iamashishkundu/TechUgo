const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Role, AdminPermission, Permission, Module } = models;

module.exports = async function getSubadmin({ subadminId }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' },
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [
      { model: Role, as: 'role' },
      {
        model: AdminPermission,
        as: 'adminPermissions',
        include: [{ model: Permission, as: 'permission', include: [{ model: Module, as: 'module' }] }]
      }
    ]
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  return subadmin;
};
