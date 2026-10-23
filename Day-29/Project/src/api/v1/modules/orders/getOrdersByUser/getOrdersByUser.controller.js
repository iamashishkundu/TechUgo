import { getOrdersByUserService } from './getOrdersByUser.service.js';

export async function getOrdersByUserController(req, res, next) {
  try {
    const { userId } = req.params;
    const orders = await getOrdersByUserService.execute(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}
