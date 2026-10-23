import { Router } from 'express';
import { getUserByIdController } from './getUserById.controller.js';
import { validateUuidParam } from '../../../../../middlewares/validateUuid.js';

const router = Router();

// GET /:id with UUID parameter validation
router.get('/:id', validateUuidParam('id'), getUserByIdController);

export default router;
