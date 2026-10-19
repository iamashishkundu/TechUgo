const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Address } = models;

module.exports = async function deleteAddress({ addressId, userId }) {
  return await sequelize.transaction(async (t) => {
    const address = await Address.findOne({
      where: { id: addressId, userId },
      transaction: t
    });

    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    const wasDefault = address.isDefault;
    await address.destroy({ transaction: t });

    if (wasDefault) {
      const nextAddress = await Address.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
        transaction: t
      });
      if (nextAddress) {
        await nextAddress.update({ isDefault: true }, { transaction: t });
      }
    }

    return { success: true };
  });
};
