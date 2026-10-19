const { models } = require('@db');

const { Setting } = models;

module.exports = async function getPublicSettings() {
  const settings = await Setting.findAll({
    where: { isPublic: true },
    attributes: ['key', 'value', 'group', 'description']
  });

  const settingsMap = {};
  for (const s of settings) {
    let val = s.value;
    if (typeof val === 'string') {
      try { val = JSON.parse(val); } catch { /* keep val as is */ }
    }
    settingsMap[s.key] = val;
  }

  return settingsMap;
};
