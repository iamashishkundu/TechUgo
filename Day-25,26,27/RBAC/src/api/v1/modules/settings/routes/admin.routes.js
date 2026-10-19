const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const getSettingsController = require('../controllers/admin/getSettings.controller');
const updateSettingsController = require('../controllers/admin/updateSettings.controller');
const toggleMaintenanceModeController = require('../controllers/admin/toggleMaintenanceMode.controller');

const updateSettingsValidation = require('../validations/admin/updateSettings.validation');
const toggleMaintenanceModeValidation = require('../validations/admin/toggleMaintenanceMode.validation');

router.patch(
  '/maintenance',
  authenticate(['admin', 'subadmin']),
  authorize('settings', 'update'),
  validate(toggleMaintenanceModeValidation),
  auditLogger({ module: 'settings', action: 'toggle_maintenance', entityType: 'setting' }),
  toggleMaintenanceModeController
);

router.get(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('settings', 'view'),
  getSettingsController
);

router.patch(
  '/',
  authenticate(['admin', 'subadmin']),
  authorize('settings', 'update'),
  validate(updateSettingsValidation),
  auditLogger({ module: 'settings', action: 'update', entityType: 'setting' }),
  updateSettingsController
);

module.exports = router;
