const { models } = require('@db');

const { Notification } = models;

module.exports = async function markAllAsRead({ recipientType, recipientId }) {
  const [affectedCount] = await Notification.update(
    {
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        recipientType,
        recipientId,
        isRead: false
      }
    }
  );

  return { success: true, updatedCount: affectedCount };
};
