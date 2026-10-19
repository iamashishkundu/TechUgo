const { models } = require('@db');

const { Admin, Role } = models;

module.exports = async function listSubadmins() {
  const subadmins = await Admin.findAll({
    where: { type: 'subadmin' },
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'description'] }],
    order: [['createdAt', 'DESC']]
  });

  return subadmins;
};
