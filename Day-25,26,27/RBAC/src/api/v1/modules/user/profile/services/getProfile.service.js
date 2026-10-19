const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function getProfile({ userId }) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['passwordHash', 'deletedAt'] }
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};
