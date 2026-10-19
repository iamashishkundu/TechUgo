const { models } = require('@db');

const { OrderStatusHistory } = models;

module.exports = async function recordStatusHistory({
  orderId,
  fromStatus,
  toStatus,
  changedByType,
  changedById = null,
  note = null,
  transaction
}) {
  return await OrderStatusHistory.create(
    {
      orderId,
      fromStatus,
      toStatus,
      changedByType,
      changedById,
      note
    },
    { transaction }
  );
};
