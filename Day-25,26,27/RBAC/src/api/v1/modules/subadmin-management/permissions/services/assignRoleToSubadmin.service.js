const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Role } = models;

module.exports = async function assignRoleToSubadmin({ subadminId, roleId }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' }
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  if (roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw ApiError.badRequest('Role not found');
    }
    await subadmin.update({ roleId });
  } else {
    await subadmin.update({ roleId: null });
  }

  return await Admin.findByPk(subadmin.id, {
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [{ model: Role, as: 'role' }]
  });
};
