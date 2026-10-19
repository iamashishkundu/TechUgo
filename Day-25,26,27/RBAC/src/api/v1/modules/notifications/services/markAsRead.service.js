const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Notification } = models;

module.exports = async function markAsRead({ recipientType, recipientId, notificationId }) {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      recipientType,
      recipientId
    }
  });

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  if (!notification.isRead) {
    await notification.update({
      isRead: true,
      readAt: new Date()
    });
  }

  return notification;
};
