const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Setting } = models;

const schemaTypeMap = {
  'site.name': (v) => typeof v === 'string' && v.trim().length > 0,
  'site.logoUrl': (v) => typeof v === 'string' && v.trim().length > 0,
  'site.supportEmail': (v) => typeof v === 'string' && v.includes('@'),
  'site.supportPhone': (v) => typeof v === 'string' && v.trim().length > 0,
  'site.maintenanceMode': (v) => typeof v === 'boolean',
  'commerce.currency': (v) => typeof v === 'string' && v.trim().length >= 3,
  'inventory.defaultLowStockThreshold': (v) => Number.isInteger(v) && v >= 0,
  'auth.allowRegistration': (v) => typeof v === 'boolean',
  'auth.requireEmailVerification': (v) => typeof v === 'boolean'
};

module.exports = async function updateSettings({ settings: inputSettings, updatedById = null }) {
  let newSettings = inputSettings;
  if (Array.isArray(newSettings)) {
    const map = {};
    for (const item of newSettings) {
      if (item && item.key) {
        map[item.key] = item.value;
      }
    }
    newSettings = map;
  }

  if (!newSettings || typeof newSettings !== 'object') {
    throw ApiError.badRequest('settings object is required');
  }

  // Validate all keys and types
  for (const [key, value] of Object.entries(newSettings)) {
    const validator = schemaTypeMap[key];
    if (!validator) {
      throw ApiError.badRequest(`Unknown setting key: "${key}"`);
    }
    if (!validator(value)) {
      throw ApiError.badRequest(`Invalid value type for setting: "${key}"`);
    }
  }

  return await sequelize.transaction(async (t) => {
    for (const [key, value] of Object.entries(newSettings)) {
      await Setting.update(
        {
          value,
          updatedById
        },
        {
          where: { key },
          transaction: t
        }
      );
    }

    const updated = await Setting.findAll({
      order: [
        ['group', 'ASC'],
        ['key', 'ASC']
      ],
      transaction: t
    });

    return updated.map((s) => {
      const item = s.toJSON();
      if (typeof item.value === 'string') {
        try { item.value = JSON.parse(item.value); } catch { /* ignore */ }
      }
      return item;
    });
  });
};
