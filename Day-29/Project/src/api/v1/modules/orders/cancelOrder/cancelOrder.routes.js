import { Router } from 'express';
import { cancelOrderController } from './cancelOrder.controller.js';
import { validateUuidParam } from '../../../../../middlewares/validateUuid.js';

const router = Router();

// POST /:id/cancel with UUID parameter validation
router.post('/:id/cancel', validateUuidParam('id'), cancelOrderController);

export default router;
