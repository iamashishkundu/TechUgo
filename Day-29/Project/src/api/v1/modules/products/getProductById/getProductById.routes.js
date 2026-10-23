import { Router } from 'express';
import { getProductByIdController } from './getProductById.controller.js';
import { validateUuidParam } from '../../../../../middlewares/validateUuid.js';

const router = Router();

// GET /:id with UUID parameter validation
router.get('/:id', validateUuidParam('id'), getProductByIdController);

export default router;
