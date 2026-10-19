const { models } = require('@db');

const { Notification } = models;

module.exports = async function getUnreadCount({ recipientType, recipientId }) {
  const unreadCount = await Notification.count({
    where: {
      recipientType,
      recipientId,
      isRead: false
    }
  });

  return { unreadCount };
};
