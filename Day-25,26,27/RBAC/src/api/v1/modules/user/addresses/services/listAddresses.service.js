const { models } = require('@db');

const { Address } = models;

module.exports = async function listAddresses({ userId }) {
  const addresses = await Address.findAll({
    where: { userId },
    order: [
      ['isDefault', 'DESC'],
      ['createdAt', 'DESC']
    ]
  });

  return addresses;
};
