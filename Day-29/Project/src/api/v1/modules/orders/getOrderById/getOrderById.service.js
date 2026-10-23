import { Order, OrderItem, Product, User } from '../../../../../database/associations.js';
import { NotFoundError } from '../../../../../middlewares/errorHandler.js';

export class GetOrderByIdService {
  async execute(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'sku', 'price'],
              },
            ],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      if (!order) {
        throw new NotFoundError(`Order with ID '${orderId}' was not found.`);
      }

      return order;
    } catch (error) {
      console.error(`[GetOrderByIdService Error] for ID ${orderId}:`, error.message);
      throw error;
    }
  }
}

export const getOrderByIdService = new GetOrderByIdService();
