const { models } = require('@db');

const { Role, Permission, Module } = models;

module.exports = async function listRoles() {
  const roles = await Role.findAll({
    include: [
      {
        model: Permission,
        as: 'permissions',
        include: [{ model: Module, as: 'module' }]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return roles;
};
