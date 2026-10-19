const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Role } = models;

module.exports = async function getProfile({ subadminId }) {
  const subadmin = await Admin.findByPk(subadminId, {
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'description'] }]
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  return subadmin;
};
