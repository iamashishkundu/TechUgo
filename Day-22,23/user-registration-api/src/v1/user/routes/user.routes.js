const { Router } = require('express');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validators/user.validator');
const userController = require('../controllers/user.controller');

const router = Router();

router.use(authenticate); // everything below this line requires a valid token

router.get('/me', userController.getMe);
router.patch('/me', validate({ body: updateProfileSchema }), userController.updateMe);

module.exports = router;
