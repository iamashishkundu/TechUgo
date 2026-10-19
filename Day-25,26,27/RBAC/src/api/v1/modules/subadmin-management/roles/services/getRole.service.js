const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Role, Permission, Module } = models;

module.exports = async function getRole({ roleId }) {
  const role = await Role.findByPk(roleId, {
    include: [
      {
        model: Permission,
        as: 'permissions',
        include: [{ model: Module, as: 'module' }]
      }
    ]
  });

  if (!role) {
    throw ApiError.notFound('Role not found');
  }

  return role;
};
