const { Router } = require('express');

const router = Router();

router.use('/auth', require('./user/routes/auth.routes'));
router.use('/users', require('./user/routes/user.routes'));
router.use('/admin/users', require('./admin/routes/admin.routes'));

module.exports = router;
