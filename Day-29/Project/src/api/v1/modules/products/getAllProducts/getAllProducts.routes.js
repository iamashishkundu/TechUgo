import { Router } from 'express';
import { getAllProductsController } from './getAllProducts.controller.js';

const router = Router();

// GET /
router.get('/', getAllProductsController);

export default router;
