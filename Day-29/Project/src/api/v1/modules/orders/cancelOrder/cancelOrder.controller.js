import { cancelOrderService } from './cancelOrder.service.js';

export async function cancelOrderController(req, res, next) {
  try {
    const { id } = req.params;
    const cancelledOrder = await cancelOrderService.execute(id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and inventory has been restocked.',
      data: {
        orderId: cancelledOrder.id,
        status: cancelledOrder.status,
        paymentStatus: cancelledOrder.paymentStatus,
        updatedAt: cancelledOrder.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
