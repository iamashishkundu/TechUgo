const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Role, Permission, Module, RolePermission } = models;

module.exports = async function createRole({ name, description = null, permissions = [], permissionIds = [] }) {
  const existing = await Role.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict(`A role with name "${name}" already exists`);
  }

  return await sequelize.transaction(async (t) => {
    const role = await Role.create(
      {
        name,
        description
      },
      { transaction: t }
    );

    const allPerms = await Permission.findAll({
      include: [{ model: Module, as: 'module' }],
      transaction: t
    });

    const permMap = new Map();
    const validPermIds = new Set();
    allPerms.forEach((p) => {
      if (p.module) {
        permMap.set(`${p.module.key}:${p.action}`, p.id);
      }
      validPermIds.add(p.id);
    });

    const rolePerms = [];
    const addedIds = new Set();

    if (permissions && permissions.length > 0) {
      for (const pKey of permissions) {
        const pId = permMap.get(pKey);
        if (pId && !addedIds.has(pId)) {
          addedIds.add(pId);
          rolePerms.push({ roleId: role.id, permissionId: pId });
        }
      }
    }

    if (permissionIds && permissionIds.length > 0) {
      for (const pId of permissionIds) {
        if (validPermIds.has(pId) && !addedIds.has(pId)) {
          addedIds.add(pId);
          rolePerms.push({ roleId: role.id, permissionId: pId });
        }
      }
    }

    if (rolePerms.length > 0) {
      await RolePermission.bulkCreate(rolePerms, { transaction: t });
    }

    return await Role.findByPk(role.id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          include: [{ model: Module, as: 'module' }]
        }
      ],
      transaction: t
    });
  });
};
