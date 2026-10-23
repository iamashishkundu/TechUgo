import { Router } from 'express';
import { getOrderByIdController } from './getOrderById.controller.js';
import { validateUuidParam } from '../../../../../middlewares/validateUuid.js';

const router = Router();

// GET /:id with UUID parameter validation
router.get('/:id', validateUuidParam('id'), getOrderByIdController);

export default router;
