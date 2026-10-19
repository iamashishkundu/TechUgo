const { models } = require('@db');

const { Module, Permission } = models;

module.exports = async function listModulesAndActions() {
  const permissions = await Permission.findAll({
    include: [{ model: Module, as: 'module' }],
    order: [['moduleId', 'ASC'], ['action', 'ASC']]
  });

  return permissions;
};
