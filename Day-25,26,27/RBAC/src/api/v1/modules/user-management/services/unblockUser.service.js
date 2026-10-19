const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function unblockUser({ userId }) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await user.update({ status: 'active' });

  return { success: true };
};
