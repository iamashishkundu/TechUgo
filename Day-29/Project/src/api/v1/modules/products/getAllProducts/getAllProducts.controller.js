import { getAllProductsService } from './getAllProducts.service.js';

export async function getAllProductsController(req, res, next) {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const products = await getAllProductsService.execute(!includeInactive);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}
