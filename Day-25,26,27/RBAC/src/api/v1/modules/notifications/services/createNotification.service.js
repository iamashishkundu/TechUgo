const { models } = require('@db');

const { Notification } = models;

module.exports = async function createNotification({
  recipientType,
  recipientId,
  type,
  title,
  body,
  data = null,
  transaction
}) {
  return await Notification.create(
    {
      recipientType,
      recipientId,
      type,
      title,
      body,
      data
    },
    { transaction }
  );
};
