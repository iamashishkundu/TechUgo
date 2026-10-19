const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function uploadAvatar({ userId, file }) {
  if (!file) {
    throw ApiError.badRequest('Avatar image file is required');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const avatarUrl = `/uploads/profiles/${file.filename}`;
  await user.update({ avatarUrl });

  return { avatarUrl };
};
