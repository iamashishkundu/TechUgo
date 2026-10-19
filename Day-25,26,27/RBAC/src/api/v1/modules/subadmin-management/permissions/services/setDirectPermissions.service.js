const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Permission, Module, AdminPermission } = models;

module.exports = async function setDirectPermissions({ subadminId, allow = [], deny = [], permissions = [] }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' }
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  return await sequelize.transaction(async (t) => {
    // Delete existing direct permissions
    await AdminPermission.destroy({ where: { adminId: subadmin.id }, transaction: t });

    const allPerms = await Permission.findAll({
      include: [{ model: Module, as: 'module' }],
      transaction: t
    });

    const permMap = new Map();
    const permIdMap = new Set();
    allPerms.forEach((p) => {
      if (p.module) {
        permMap.set(`${p.module.key}:${p.action}`, p.id);
      }
      permIdMap.add(p.id);
    });

    const toInsert = [];
    for (const pKey of allow) {
      const pId = permMap.get(pKey);
      if (pId) {
        toInsert.push({ adminId: subadmin.id, permissionId: pId, effect: 'allow' });
      }
    }
    for (const pKey of deny) {
      const pId = permMap.get(pKey);
      if (pId) {
        toInsert.push({ adminId: subadmin.id, permissionId: pId, effect: 'deny' });
      }
    }
    for (const item of permissions) {
      let pId = item.permissionId;
      if (!pId && item.permission) {
        pId = permMap.get(item.permission);
      }
      if (pId && permIdMap.has(pId)) {
        toInsert.push({ adminId: subadmin.id, permissionId: pId, effect: item.effect });
      }
    }

    if (toInsert.length > 0) {
      await AdminPermission.bulkCreate(toInsert, { transaction: t });
    }

    return await Admin.findByPk(subadmin.id, {
      attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
      include: [
        {
          model: AdminPermission,
          as: 'adminPermissions',
          include: [{ model: Permission, as: 'permission', include: [{ model: Module, as: 'module' }] }]
        }
      ],
      transaction: t
    });
  });
};
