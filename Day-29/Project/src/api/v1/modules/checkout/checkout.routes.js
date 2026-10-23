import { Router } from 'express';
import { checkoutController } from './checkout.controller.js';
import { validateCheckoutPayload } from './checkout.validation.js';

const router = Router();

/**
 * Option 2: Self-Contained Module Plugin Path
 */
export const basePath = '/api/v1/checkout';

// POST /api/v1/checkout
router.post('/', validateCheckoutPayload, (req, res, next) => {
  checkoutController.handleCheckout(req, res, next);
});

export default router;
