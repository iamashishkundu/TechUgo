const { models } = require('@db');
const permissionService = require('@services/permission.service');
const createNotification = require('./createNotification.service');

const { Admin } = models;

module.exports = async function notifyAdmins({
  permission, // e.g. 'inventory:view'
  type,
  title,
  body,
  data = null,
  transaction
}) {
  const [moduleKey, action] = (permission || '').split(':');

  const admins = await Admin.findAll({
    where: { status: 'active' },
    transaction
  });

  const notifications = [];
  for (const admin of admins) {
    let shouldNotify = false;

    if (admin.type === 'super_admin') {
      shouldNotify = true;
    } else if (moduleKey && action) {
      shouldNotify = await permissionService.hasPermission(admin.id, moduleKey, action);
    } else {
      shouldNotify = true;
    }

    if (shouldNotify) {
      notifications.push(
        createNotification({
          recipientType: 'admin',
          recipientId: admin.id,
          type,
          title,
          body,
          data,
          transaction
        })
      );
    }
  }

  return await Promise.all(notifications);
};
