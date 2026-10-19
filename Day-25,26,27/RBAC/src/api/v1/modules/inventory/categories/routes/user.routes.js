const router = require('express').Router();
const listActiveCategoriesController = require('../controllers/user/listActiveCategories.controller');

// Public route to list active categories
router.get('/', listActiveCategoriesController);

module.exports = router;
