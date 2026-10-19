const router = require('express').Router();
const listFaqsController = require('../controllers/user/listFaqs.controller');

// Public route to view FAQs grouped by category
router.get('/', listFaqsController);

module.exports = router;
