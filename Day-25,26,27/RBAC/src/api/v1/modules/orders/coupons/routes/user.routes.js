const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const listAvailableCouponsController = require('../controllers/user/listAvailableCoupons.controller');
const applyCouponController = require('../controllers/user/applyCoupon.controller');
const removeCouponController = require('../controllers/user/removeCoupon.controller');

const applyCouponValidation = require('../validations/user/applyCoupon.validation');

router.get('/coupons', authenticate('user'), listAvailableCouponsController);
router.post(
  '/coupons/apply',
  authenticate('user'),
  validate(applyCouponValidation),
  applyCouponController
);
router.delete('/coupons/apply', authenticate('user'), removeCouponController);

module.exports = router;
