import { User } from '../../../../../database/associations.js';

export class GetAllUsersService {
  async execute() {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'createdAt'],
        order: [['name', 'ASC']],
      });
      return users;
    } catch (error) {
      console.error('[GetAllUsersService Error]:', error.message);
      throw error;
    }
  }
}

export const getAllUsersService = new GetAllUsersService();
