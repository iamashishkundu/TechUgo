const { sequelize, models } = require('@db');
const passwordService = require('@services/auth/password.service');
const ApiError = require('@utils/ApiError');

const { Admin, Role, Permission, Module, AdminPermission } = models;

module.exports = async function createSubadmin(input) {
  const {
    fullName,
    email,
    phone,
    password,
    roleId = null,
    allow = [],
    deny = [],
    createdById = null
  } = input;

  const cleanEmail = email.toLowerCase().trim();

  // Check unique active email
  const existing = await Admin.findOne({ where: { email: cleanEmail } });
  if (existing) {
    throw ApiError.conflict('An admin or subadmin with this email already exists');
  }

  return await sequelize.transaction(async (t) => {
    if (roleId) {
      const role = await Role.findByPk(roleId, { transaction: t });
      if (!role) {
        throw ApiError.badRequest('Specified role does not exist');
      }
    }

    const passwordHash = passwordService.hashPassword(password);

    const subadmin = await Admin.create(
      {
        type: 'subadmin',
        fullName,
        email: cleanEmail,
        phone,
        passwordHash,
        status: 'active',
        roleId: roleId || null,
        createdById
      },
      { transaction: t }
    );

    // Process direct permissions
    if ((allow && allow.length > 0) || (deny && deny.length > 0)) {
      const allPerms = await Permission.findAll({
        include: [{ model: Module, as: 'module' }],
        transaction: t
      });
      const permMap = new Map();
      allPerms.forEach((p) => {
        if (p.module) {
          permMap.set(`${p.module.key}:${p.action}`, p.id);
        }
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

      if (toInsert.length > 0) {
        await AdminPermission.bulkCreate(toInsert, { transaction: t });
      }
    }

    return await Admin.findByPk(subadmin.id, {
      attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
      include: [{ model: Role, as: 'role' }],
      transaction: t
    });
  });
};
