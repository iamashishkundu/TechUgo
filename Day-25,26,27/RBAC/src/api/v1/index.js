const express = require('express');
const { models } = require('@db');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const router = express.Router();

// Inline Maintenance-Mode Middleware
// Returns 503 for all endpoints except /admin/*, /subadmin/*, /settings/public, and health checks
router.use(async (req, res, next) => {
  const currentPath = req.path;
  if (
    currentPath === '/health' ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/subadmin') ||
    currentPath.startsWith('/settings/public')
  ) {
    return next();
  }

  try {
    const maintenanceSetting = await models.Setting.findOne({
      where: { key: 'site.maintenanceMode' }
    });

    if (maintenanceSetting) {
      let isEnabled = maintenanceSetting.value;
      if (typeof isEnabled === 'string') {
        try {
          isEnabled = JSON.parse(isEnabled);
        } catch {
          isEnabled = false;
        }
      }
      if (isEnabled === true) {
        return res.status(503).json({
          success: false,
          message: MESSAGES.MAINTENANCE_MODE,
          code: ERROR_CODES.MAINTENANCE_MODE
        });
      }
    }
  } catch {
    // Pass on error to avoid blocking the app
  }

  return next();
});

// Health check endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime()
    }
  });
});

// ==========================================
// DIRECT ROUTE MOUNTS (No index.js facades)
// ==========================================

// 1. User Management
router.use('/admin/user-management', require('./modules/user-management/routes/userManagement.routes'));

// 2. Subadmin Management
router.use('/admin/subadmin-management/subadmins', require('./modules/subadmin-management/subadmins/routes/subadmins.routes'));
router.use('/admin/subadmin-management/roles', require('./modules/subadmin-management/roles/routes/roles.routes'));
router.use('/admin/subadmin-management/permissions', require('./modules/subadmin-management/permissions/routes/permissions.routes'));

// 3. Inventory (Admin)
router.use('/admin/inventory/categories', require('./modules/inventory/categories/routes/admin.routes'));
router.use('/admin/inventory/products', require('./modules/inventory/products/routes/admin.routes'));
router.use('/admin/inventory/stock', require('./modules/inventory/stock/routes/admin.routes'));

// 4. Notifications (Admin)
router.use('/admin/notifications', require('./modules/notifications/routes/admin.routes'));

// 5. FAQ (Admin)
router.use('/admin/faq/categories', require('./modules/faq/categories/routes/admin.routes'));
router.use('/admin/faq', require('./modules/faq/faqs/routes/admin.routes'));

// 6. Settings (Admin & Public)
router.use('/admin/settings', require('./modules/settings/routes/admin.routes'));
router.use('/settings/public', require('./modules/settings/routes/public.routes'));

// 7. Help Tickets (Admin)
router.use('/admin/help', require('./modules/help/routes/admin.routes'));

// 8. Admin Self (Auth, Profile, Audit Logs)
router.use('/admin/auth', require('./modules/admin/auth/routes/session.routes'));
router.use('/admin/auth', require('./modules/admin/auth/routes/password.routes'));
router.use('/admin/auth/2fa', require('./modules/admin/auth/routes/twoFactor.routes'));
router.use('/admin/profile', require('./modules/admin/profile/routes/profile.routes'));
router.use('/admin/audit-logs', require('./modules/admin/audit-logs/routes/auditLogs.routes'));

// 9. Subadmin Self (Auth, Profile)
router.use('/subadmin/auth', require('./modules/subadmin/auth/routes/session.routes'));
router.use('/subadmin/auth', require('./modules/subadmin/auth/routes/password.routes'));
router.use('/subadmin/auth/2fa', require('./modules/subadmin/auth/routes/twoFactor.routes'));
router.use('/subadmin/profile', require('./modules/subadmin/profile/routes/profile.routes'));

// 10. Orders & Coupons (Admin)
router.use('/admin', require('./modules/orders/coupons/routes/admin.routes'));
router.use('/admin', require('./modules/orders/orders/routes/admin.routes'));

// 11. Wallets (Admin)
router.use('/admin', require('./modules/wallet/routes/admin.routes'));

// 12. Transactions, Invoices & Reports (Admin)
router.use('/admin', require('./modules/transactions/transactions/routes/admin.routes'));
router.use('/admin', require('./modules/transactions/invoices/routes/admin.routes'));
router.use('/admin', require('./modules/transactions/reports/routes/admin.routes'));

// 13. User Self (Auth, Profile, Addresses)
router.use('/user/auth', require('./modules/user/auth/routes/registration.routes'));
router.use('/user/auth', require('./modules/user/auth/routes/session.routes'));
router.use('/user/auth', require('./modules/user/auth/routes/password.routes'));
router.use('/user/auth', require('./modules/user/auth/routes/verification.routes'));
router.use('/user/profile', require('./modules/user/profile/routes/profile.routes'));
router.use('/user/profile/addresses', require('./modules/user/addresses/routes/addresses.routes'));
router.use('/user/addresses', require('./modules/user/addresses/routes/addresses.routes'));

// 14. Customer-facing Catalog, Notifications, FAQ, Help
router.use('/catalog/categories', require('./modules/inventory/categories/routes/user.routes'));
router.use('/catalog/products', require('./modules/inventory/products/routes/user.routes'));
router.use('/notifications', require('./modules/notifications/routes/user.routes'));
router.use('/faq', require('./modules/faq/faqs/routes/user.routes'));
router.use('/help', require('./modules/help/routes/user.routes'));

// 15. User Root Commerce (Cart, Coupons, Orders, Wallet, Transactions, Invoices)
router.use('/', require('./modules/orders/cart/routes/user.routes'));
router.use('/', require('./modules/orders/coupons/routes/user.routes'));
router.use('/', require('./modules/orders/orders/routes/user.routes'));
router.use('/', require('./modules/wallet/routes/user.routes'));
router.use('/', require('./modules/transactions/transactions/routes/user.routes'));
router.use('/', require('./modules/transactions/invoices/routes/user.routes'));

module.exports = router;
