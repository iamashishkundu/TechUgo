const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');
const { uploadTicketAttachments } = require('@middlewares/upload');

const listTicketsController = require('../controllers/admin/listTickets.controller');
const getTicketController = require('../controllers/admin/getTicket.controller');
const replyToTicketAsStaffController = require('../controllers/admin/replyToTicketAsStaff.controller');
const updateTicketStatusController = require('../controllers/admin/updateTicketStatus.controller');

const listTicketsValidation = require('../validations/admin/listTickets.validation');
const replyToTicketAsStaffValidation = require('../validations/admin/replyToTicketAsStaff.validation');
const updateTicketStatusValidation = require('../validations/admin/updateTicketStatus.validation');

router.get(
  '/tickets',
  authenticate(['admin', 'subadmin']),
  authorize('help', 'view'),
  validate(listTicketsValidation),
  listTicketsController
);

router.get(
  '/tickets/:ticketId',
  authenticate(['admin', 'subadmin']),
  authorize('help', 'view'),
  getTicketController
);

router.post(
  '/tickets/:ticketId/replies',
  authenticate(['admin', 'subadmin']),
  authorize('help', 'create'),
  uploadTicketAttachments,
  validate(replyToTicketAsStaffValidation),
  auditLogger({ module: 'help', action: 'staff_reply', entityType: 'ticket' }),
  replyToTicketAsStaffController
);

router.patch(
  '/tickets/:ticketId/status',
  authenticate(['admin', 'subadmin']),
  authorize('help', 'update'),
  validate(updateTicketStatusValidation),
  auditLogger({ module: 'help', action: 'update_status', entityType: 'ticket' }),
  updateTicketStatusController
);

module.exports = router;
