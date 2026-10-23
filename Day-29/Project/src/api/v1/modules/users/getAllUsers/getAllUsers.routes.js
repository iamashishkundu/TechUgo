import { Router } from 'express';
import { getAllUsersController } from './getAllUsers.controller.js';

const router = Router();

// GET /
router.get('/', getAllUsersController);

export default router;
