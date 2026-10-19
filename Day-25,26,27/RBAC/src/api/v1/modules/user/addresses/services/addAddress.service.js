const { sequelize, models } = require('@db');

const { Address } = models;

module.exports = async function addAddress(input) {
  const {
    userId,
    label,
    recipientName,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault
  } = input;

  return await sequelize.transaction(async (t) => {
    const count = await Address.count({ where: { userId }, transaction: t });
    const shouldBeDefault = isDefault === true || count === 0;

    if (shouldBeDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId, isDefault: true }, transaction: t }
      );
    }

    const address = await Address.create(
      {
        userId,
        label,
        recipientName,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        postalCode,
        country,
        isDefault: shouldBeDefault
      },
      { transaction: t }
    );

    return address;
  });
};
