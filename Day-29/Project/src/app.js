import express from 'express';

// Direct Vertical Slice Route Imports
import checkoutRouter, { basePath as checkoutPath } from './api/v1/modules/checkout/checkout.routes.js';

// Order Slices
import getOrdersByUserRouter from './api/v1/modules/orders/getOrdersByUser/getOrdersByUser.routes.js';
import cancelOrderRouter from './api/v1/modules/orders/cancelOrder/cancelOrder.routes.js';
import getOrderByIdRouter from './api/v1/modules/orders/getOrderById/getOrderById.routes.js';

// Product Slices
import getAllProductsRouter from './api/v1/modules/products/getAllProducts/getAllProducts.routes.js';
import getProductByIdRouter from './api/v1/modules/products/getProductById/getProductById.routes.js';

// User Slices
import getAllUsersRouter from './api/v1/modules/users/getAllUsers/getAllUsers.routes.js';
import getUserByIdRouter from './api/v1/modules/users/getUserById/getUserById.routes.js';

// Global Middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';

const app = express();

// Standard Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'ecommerce-checkout-engine',
  });
});

/**
 * Direct Vertical Slice Plugin Mounting (Zero Middleman Wrappers)
 */
const slicePlugins = [
  // Checkout
  { path: checkoutPath, router: checkoutRouter, name: 'Checkout: processCheckout' },

  // Orders (Specific sub-paths first to prevent greedy :id capture)
  { path: '/api/v1/orders', router: getOrdersByUserRouter, name: 'Orders: getOrdersByUser' },
  { path: '/api/v1/orders', router: cancelOrderRouter, name: 'Orders: cancelOrder' },
  { path: '/api/v1/orders', router: getOrderByIdRouter, name: 'Orders: getOrderById' },

  // Products
  { path: '/api/v1/products', router: getAllProductsRouter, name: 'Products: getAllProducts' },
  { path: '/api/v1/products', router: getProductByIdRouter, name: 'Products: getProductById' },

  // Users
  { path: '/api/v1/users', router: getAllUsersRouter, name: 'Users: getAllUsers' },
  { path: '/api/v1/users', router: getUserByIdRouter, name: 'Users: getUserById' },
];

slicePlugins.forEach(({ path, router }) => {
  app.use(path, router);
});

// Fallback for non-existent endpoints
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
