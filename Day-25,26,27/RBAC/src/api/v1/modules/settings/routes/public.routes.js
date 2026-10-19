const router = require('express').Router();
const getPublicSettingsController = require('../controllers/public/getPublicSettings.controller');

router.get('/', getPublicSettingsController);

module.exports = router;
