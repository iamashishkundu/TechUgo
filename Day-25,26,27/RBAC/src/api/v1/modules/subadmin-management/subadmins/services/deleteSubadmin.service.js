const { models } = require('@db');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function deleteSubadmin({ subadminId }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' }
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  await subadmin.destroy();
  await sessionService.revokeAllForActor('subadmin', subadmin.id);

  return { success: true };
};
