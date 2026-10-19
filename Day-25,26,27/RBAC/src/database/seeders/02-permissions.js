const { v4: uuidv4 } = require('uuid');

const actions = ['view', 'create', 'update', 'delete', 'export'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const modules = await queryInterface.sequelize.query(
      'SELECT id, key FROM modules',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingPerms = await queryInterface.sequelize.query(
      'SELECT module_id, action FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSet = new Set(existingPerms.map((p) => `${p.module_id}:${p.action}`));

    const toInsert = [];
    for (const mod of modules) {
      for (const action of actions) {
        if (!existingSet.has(`${mod.id}:${action}`)) {
          toInsert.push({
            id: uuidv4(),
            module_id: mod.id,
            action,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }
    }

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('permissions', toInsert);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
