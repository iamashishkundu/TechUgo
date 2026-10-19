const { models } = require('@db');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function blockUser({ userId }) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await user.update({ status: 'blocked' });
  await sessionService.revokeAllForActor('user', user.id);

  return { success: true };
};
