const { models } = require('@db');

const { Setting } = models;

module.exports = async function getSettingValue(key, defaultValue = null) {
  const setting = await Setting.findOne({ where: { key } });
  if (!setting) {
    return defaultValue;
  }

  let val = setting.value;
  if (typeof val === 'string') {
    try {
      val = JSON.parse(val);
    } catch {
      // keep raw string
    }
  }

  return val;
};
