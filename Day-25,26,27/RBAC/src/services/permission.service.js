const { models } = require('@db');
const { MODULES } = require('@constants/modules');
const { ACTIONS } = require('@constants/actions');

const { Admin, Role, Permission, Module, AdminPermission } = models;

const permissionService = {
  /**
   * Resolves effective permissions for an admin/subadmin.
   * effective = (rolePermissions ∪ direct allows) − direct denies
   * Direct denies ALWAYS win.
   * Super admin gets ALL permissions.
   * @param {string} adminId
   * @returns {Promise<string[]>} Array of "<module>:<action>" strings
   */
  async getEffectivePermissions(adminId) {
    const admin = await Admin.findByPk(adminId, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
              as: 'permissions',
              include: [{ model: Module, as: 'module' }]
            }
          ]
        },
        {
          model: AdminPermission,
          as: 'adminPermissions',
          include: [
            {
              model: Permission,
              as: 'permission',
              include: [{ model: Module, as: 'module' }]
            }
          ]
        }
      ]
    });

    if (!admin) {
      return [];
    }

    // Super admin has every permission
    if (admin.type === 'super_admin') {
      const allPermissions = [];
      for (const mod of Object.values(MODULES)) {
        for (const act of Object.values(ACTIONS)) {
          allPermissions.push(`${mod}:${act}`);
        }
      }
      return allPermissions;
    }

    const permissionSet = new Set();
    const denySet = new Set();

    // 1. Add permissions from Role
    if (admin.role && admin.role.permissions) {
      for (const perm of admin.role.permissions) {
        if (perm.module) {
          permissionSet.add(`${perm.module.key}:${perm.action}`);
        }
      }
    }

    // 2. Add direct allows and gather direct denies
    if (admin.adminPermissions) {
      for (const ap of admin.adminPermissions) {
        if (ap.permission && ap.permission.module) {
          const permKey = `${ap.permission.module.key}:${ap.permission.action}`;
          if (ap.effect === 'allow') {
            permissionSet.add(permKey);
          } else if (ap.effect === 'deny') {
            denySet.add(permKey);
          }
        }
      }
    }

    // 3. Direct deny always wins
    for (const denied of denySet) {
      permissionSet.delete(denied);
    }

    return Array.from(permissionSet);
  },

  /**
   * Checks if an admin has a specific module:action permission.
   */
  async hasPermission(adminId, moduleKey, action) {
    const effective = await this.getEffectivePermissions(adminId);
    return effective.includes(`${moduleKey}:${action}`);
  }
};

module.exports = permissionService;
