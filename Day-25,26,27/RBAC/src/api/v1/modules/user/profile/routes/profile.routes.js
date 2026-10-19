const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');
const { uploadAvatar } = require('@middlewares/upload');

const getProfileController = require('../controllers/getProfile.controller');
const updateProfileController = require('../controllers/updateProfile.controller');
const changePasswordController = require('../controllers/changePassword.controller');
const uploadAvatarController = require('../controllers/uploadAvatar.controller');

const updateProfileValidation = require('../validations/updateProfile.validation');
const changePasswordValidation = require('../validations/changePassword.validation');

router.get('/', authenticate(['user']), getProfileController);
router.patch('/', authenticate(['user']), validate(updateProfileValidation), updateProfileController);
router.patch('/change-password', authenticate(['user']), validate(changePasswordValidation), changePasswordController);
router.post('/avatar', authenticate(['user']), uploadAvatar, uploadAvatarController);

module.exports = router;
