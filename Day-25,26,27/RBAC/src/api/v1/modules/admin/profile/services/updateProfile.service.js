const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function updateProfile({ adminId, fullName, phone }) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;

  await admin.update(updates);

  return {
    id: admin.id,
    type: admin.type,
    fullName: admin.fullName,
    email: admin.email,
    phone: admin.phone,
    avatarUrl: admin.avatarUrl
  };
};
