import { getUserByIdService } from './getUserById.service.js';

export async function getUserByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getUserByIdService.execute(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
