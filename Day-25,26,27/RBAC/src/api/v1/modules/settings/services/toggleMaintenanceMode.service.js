const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Setting } = models;

module.exports = async function toggleMaintenanceMode({ enabled, updatedById = null }) {
  if (typeof enabled !== 'boolean') {
    throw ApiError.badRequest('enabled must be a boolean');
  }

  const setting = await Setting.findOne({ where: { key: 'site.maintenanceMode' } });
  if (!setting) {
    throw ApiError.notFound('Maintenance mode setting not found');
  }

  await setting.update({
    value: enabled,
    updatedById
  });

  return {
    key: setting.key,
    enabled
  };
};
