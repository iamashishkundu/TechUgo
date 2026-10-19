const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Role } = models;

module.exports = async function updateSubadmin({ subadminId, fullName, phone, roleId }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' }
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;
  if (roleId !== undefined) {
    if (roleId) {
      const role = await Role.findByPk(roleId);
      if (!role) {
        throw ApiError.badRequest('Specified role does not exist');
      }
      updates.roleId = roleId;
    } else {
      updates.roleId = null;
    }
  }

  await subadmin.update(updates);

  return await Admin.findByPk(subadmin.id, {
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [{ model: Role, as: 'role' }]
  });
};
