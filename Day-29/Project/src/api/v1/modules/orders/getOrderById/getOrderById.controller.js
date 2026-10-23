import { getOrderByIdService } from './getOrderById.service.js';

export async function getOrderByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService.execute(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
