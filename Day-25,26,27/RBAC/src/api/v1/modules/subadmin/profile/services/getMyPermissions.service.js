const permissionService = require('@services/permission.service');

module.exports = async function getMyPermissions({ subadminId }) {
  const permissions = await permissionService.getEffectivePermissions(subadminId);
  return { permissions };
};
