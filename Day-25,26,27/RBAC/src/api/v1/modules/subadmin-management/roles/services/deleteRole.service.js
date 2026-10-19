const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Role, Admin } = models;

module.exports = async function deleteRole({ roleId }) {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw ApiError.notFound('Role not found');
  }

  const assignedCount = await Admin.count({ where: { roleId } });
  if (assignedCount > 0) {
    throw ApiError.conflict('Role is assigned to one or more subadmins and cannot be deleted');
  }

  await role.destroy();
  return { success: true };
};
