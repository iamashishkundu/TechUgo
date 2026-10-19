const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const listAuditLogsController = require('../controllers/listAuditLogs.controller');
const getAuditLogController = require('../controllers/getAuditLog.controller');
const listAuditLogsValidation = require('../validations/listAuditLogs.validation');

router.get('/', authenticate(['admin']), validate(listAuditLogsValidation), listAuditLogsController);
router.get('/:auditLogId', authenticate(['admin']), getAuditLogController);

module.exports = router;
