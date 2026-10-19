const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function updateUser({ userId, fullName, phone }) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;

  await user.update(updates);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    status: user.status,
    isEmailVerified: user.isEmailVerified
  };
};
