const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function updateProfile({ subadminId, fullName, phone }) {
  const subadmin = await Admin.findByPk(subadminId);
  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;

  await subadmin.update(updates);

  return {
    id: subadmin.id,
    type: subadmin.type,
    fullName: subadmin.fullName,
    email: subadmin.email,
    phone: subadmin.phone,
    avatarUrl: subadmin.avatarUrl
  };
};
