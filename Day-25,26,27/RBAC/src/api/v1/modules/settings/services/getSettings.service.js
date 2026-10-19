const { models } = require('@db');

const { Setting } = models;

module.exports = async function getSettings() {
  const settings = await Setting.findAll({
    order: [
      ['group', 'ASC'],
      ['key', 'ASC']
    ]
  });

  const parsedSettings = settings.map((s) => {
    const item = s.toJSON();
    if (typeof item.value === 'string') {
      try { item.value = JSON.parse(item.value); } catch { /* keep as is */ }
    }
    return item;
  });

  return parsedSettings;
};
