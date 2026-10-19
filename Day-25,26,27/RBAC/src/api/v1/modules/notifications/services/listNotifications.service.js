const { models } = require('@db');

const { Notification } = models;

module.exports = async function listNotifications({ adminId, isRead, page = 1, limit = 20 } = {}) {
  const where = {
    recipientType: 'admin',
    recipientId: adminId
  };

  if (isRead !== undefined) {
    where.isRead = isRead === true || isRead === 'true';
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Notification.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    notifications: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
