const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function unblockSubadmin({ subadminId }) {
  const subadmin = await Admin.findOne({
    where: { id: subadminId, type: 'subadmin' }
  });

  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  await subadmin.update({ status: 'active' });

  return { success: true };
};
