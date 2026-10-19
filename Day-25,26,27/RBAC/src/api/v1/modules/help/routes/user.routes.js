const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const { uploadTicketAttachments } = require('@middlewares/upload');

const createTicketController = require('../controllers/user/createTicket.controller');
const listMyTicketsController = require('../controllers/user/listMyTickets.controller');
const getMyTicketController = require('../controllers/user/getMyTicket.controller');
const replyToTicketController = require('../controllers/user/replyToTicket.controller');
const closeMyTicketController = require('../controllers/user/closeMyTicket.controller');

const createTicketValidation = require('../validations/user/createTicket.validation');
const replyToTicketValidation = require('../validations/user/replyToTicket.validation');

router.post(
  '/tickets',
  authenticate('user'),
  uploadTicketAttachments,
  validate(createTicketValidation),
  createTicketController
);

router.get('/tickets', authenticate('user'), listMyTicketsController);
router.get('/tickets/:ticketId', authenticate('user'), getMyTicketController);

router.post(
  '/tickets/:ticketId/replies',
  authenticate('user'),
  uploadTicketAttachments,
  validate(replyToTicketValidation),
  replyToTicketController
);

router.patch('/tickets/:ticketId/close', authenticate('user'), closeMyTicketController);

module.exports = router;
