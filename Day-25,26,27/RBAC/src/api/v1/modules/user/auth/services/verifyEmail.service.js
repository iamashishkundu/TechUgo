const { models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function verifyEmail({ token }) {
  const { actorType, actorId } = await authTokenService.verifyAndConsumeToken({
    rawToken: token,
    purpose: 'email_verification'
  });

  if (actorType !== 'user') {
    throw ApiError.badRequest('Invalid token for user account');
  }

  const user = await User.findByPk(actorId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await user.update({ isEmailVerified: true });

  return { success: true };
};
