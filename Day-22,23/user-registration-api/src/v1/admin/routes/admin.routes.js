const { Router } = require('express');
const authenticate = require('../../user/middlewares/auth.middleware');
const validate = require('../../user/middlewares/validate.middleware');
const { idParamSchema } = require('../../user/validators/id.validator');
const authorize = require('../middlewares/role.middleware');
const { adminUpdateUserSchema } = require('../validators/admin.validator');
const adminController = require('../controllers/admin.controller');

const router = Router();

// Order matters: identify first, then check the role
router.use(authenticate, authorize('admin'));

router.get('/', adminController.listUsers);
router.get('/:id', validate({ params: idParamSchema }), adminController.getUser);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: adminUpdateUserSchema }),
  adminController.updateUser
);
router.delete('/:id', validate({ params: idParamSchema }), adminController.deleteUser);

module.exports = router;
