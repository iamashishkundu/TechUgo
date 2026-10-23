import { Router } from 'express';
import { getOrdersByUserController } from './getOrdersByUser.controller.js';
import { validateUuidParam } from '../../../../../middlewares/validateUuid.js';

const router = Router();

// GET /user/:userId with UUID parameter validation
router.get('/user/:userId', validateUuidParam('userId'), getOrdersByUserController);

export default router;
