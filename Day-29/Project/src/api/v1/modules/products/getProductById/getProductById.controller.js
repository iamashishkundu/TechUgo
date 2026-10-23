import { getProductByIdService } from './getProductById.service.js';

export async function getProductByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductByIdService.execute(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
