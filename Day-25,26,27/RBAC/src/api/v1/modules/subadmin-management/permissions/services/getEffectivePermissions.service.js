const permissionService = require('@services/permission.service');

module.exports = async function getEffectivePermissions({ subadminId }) {
  const permissions = await permissionService.getEffectivePermissions(subadminId);
  return { permissions };
};
