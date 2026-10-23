import { Order, OrderItem, Product, User } from '../../../../../database/associations.js';
import { NotFoundError } from '../../../../../middlewares/errorHandler.js';

export class GetOrdersByUserService {
  async execute(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError(`User with ID '${userId}' was not found.`);
      }

      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            as: 'items',
            attributes: ['id', 'productId', 'quantity', 'unitPrice', 'subtotal'],
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'sku'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return orders;
    } catch (error) {
      console.error(`[GetOrdersByUserService Error] for User ${userId}:`, error.message);
      throw error;
    }
  }
}

export const getOrdersByUserService = new GetOrdersByUserService();
