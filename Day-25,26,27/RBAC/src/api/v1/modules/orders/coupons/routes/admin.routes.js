const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const auditLogger = require('@middlewares/auditLogger');

const listCouponsController = require('../controllers/admin/listCoupons.controller');
const createCouponController = require('../controllers/admin/createCoupon.controller');
const getCouponController = require('../controllers/admin/getCoupon.controller');
const updateCouponController = require('../controllers/admin/updateCoupon.controller');
const deleteCouponController = require('../controllers/admin/deleteCoupon.controller');

const createCouponValidation = require('../validations/admin/createCoupon.validation');
const updateCouponValidation = require('../validations/admin/updateCoupon.validation');

router.get(
  '/coupons',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'view'),
  listCouponsController
);

router.post(
  '/coupons',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'create'),
  validate(createCouponValidation),
  auditLogger({ module: 'orders', action: 'create_coupon', entityType: 'coupon' }),
  createCouponController
);

router.get(
  '/coupons/:couponId',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'view'),
  getCouponController
);

router.patch(
  '/coupons/:couponId',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'update'),
  validate(updateCouponValidation),
  auditLogger({ module: 'orders', action: 'update_coupon', entityType: 'coupon' }),
  updateCouponController
);

router.delete(
  '/coupons/:couponId',
  authenticate(['admin', 'subadmin']),
  authorize('orders', 'delete'),
  auditLogger({ module: 'orders', action: 'delete_coupon', entityType: 'coupon' }),
  deleteCouponController
);

module.exports = router;
