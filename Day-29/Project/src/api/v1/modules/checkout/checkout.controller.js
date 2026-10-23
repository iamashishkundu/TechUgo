import { checkoutService } from './checkout.service.js';

export class CheckoutController {
  /**
   * POST /api/v1/checkout
   * Processes cart checkout within an atomic ACID transaction
   */
  async handleCheckout(req, res, next) {
    try {
      const { userId, items } = req.body;
      const receipt = await checkoutService.processCheckout({ userId, items });

      res.status(201).json({
        success: true,
        message: 'Order created and inventory reserved successfully.',
        data: receipt,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const checkoutController = new CheckoutController();
