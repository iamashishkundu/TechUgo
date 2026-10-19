const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin, Role } = models;

module.exports = async function getProfile({ adminId }) {
  const admin = await Admin.findByPk(adminId, {
    attributes: { exclude: ['passwordHash', 'twoFactorSecret', 'deletedAt'] },
    include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'description'] }]
  });

  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  return admin;
};
