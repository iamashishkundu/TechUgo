import { Product } from '../../../../../database/associations.js';
import { NotFoundError } from '../../../../../middlewares/errorHandler.js';

export class GetProductByIdService {
  async execute(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new NotFoundError(`Product with ID '${id}' was not found.`);
      }
      return product;
    } catch (error) {
      console.error(`[GetProductByIdService Error] for ID ${id}:`, error.message);
      throw error;
    }
  }
}

export const getProductByIdService = new GetProductByIdService();
