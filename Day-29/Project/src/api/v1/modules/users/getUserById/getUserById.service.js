import { User } from '../../../../../database/associations.js';
import { NotFoundError } from '../../../../../middlewares/errorHandler.js';

export class GetUserByIdService {
  async execute(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'createdAt'],
      });
      if (!user) {
        throw new NotFoundError(`User with ID '${id}' was not found.`);
      }
      return user;
    } catch (error) {
      console.error(`[GetUserByIdService Error] for ID ${id}:`, error.message);
      throw error;
    }
  }
}

export const getUserByIdService = new GetUserByIdService();
