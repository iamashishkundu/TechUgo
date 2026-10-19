const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Address } = models;

module.exports = async function updateAddress({ addressId, userId, ...updates }) {
  return await sequelize.transaction(async (t) => {
    const address = await Address.findOne({
      where: { id: addressId, userId },
      transaction: t
    });

    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    if (updates.isDefault === true) {
      await Address.update(
        { isDefault: false },
        { where: { userId, isDefault: true }, transaction: t }
      );
    }

    await address.update(updates, { transaction: t });
    return address;
  });
};
