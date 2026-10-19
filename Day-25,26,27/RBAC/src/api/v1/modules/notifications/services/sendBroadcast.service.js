const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Notification, User, Admin } = models;

module.exports = async function sendBroadcast({ title, body, audience }) {
  let recipients = [];
  let recipientType = '';

  if (audience === 'users') {
    recipientType = 'user';
    recipients = await User.findAll({
      where: { status: 'active' },
      attributes: ['id']
    });
  } else if (audience === 'staff') {
    recipientType = 'admin';
    recipients = await Admin.findAll({
      where: { status: 'active' },
      attributes: ['id']
    });
  } else {
    throw ApiError.badRequest('Invalid audience. Must be "users" or "staff"');
  }

  if (recipients.length === 0) {
    return { count: 0 };
  }

  const notificationRecords = recipients.map((r) => ({
    recipientType,
    recipientId: r.id,
    type: 'broadcast',
    title,
    body
  }));

  await Notification.bulkCreate(notificationRecords);

  return {
    audience,
    recipientCount: recipients.length
  };
};
