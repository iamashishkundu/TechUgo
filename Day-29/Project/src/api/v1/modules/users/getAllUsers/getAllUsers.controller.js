import { getAllUsersService } from './getAllUsers.service.js';

export async function getAllUsersController(req, res, next) {
  try {
    const users = await getAllUsersService.execute();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
