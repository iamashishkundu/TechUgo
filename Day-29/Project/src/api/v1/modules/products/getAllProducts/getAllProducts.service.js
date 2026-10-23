import { Product } from '../../../../../database/associations.js';

export class GetAllProductsService {
  async execute(onlyActive = true) {
    try {
      const where = onlyActive ? { isActive: true } : {};
      const products = await Product.findAll({
        where,
        order: [['title', 'ASC']],
      });
      return products;
    } catch (error) {
      console.error('[GetAllProductsService Error]:', error.message);
      throw error;
    }
  }
}

export const getAllProductsService = new GetAllProductsService();
