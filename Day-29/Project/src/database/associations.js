import { sequelize } from '../config/database.js';
import User from '../api/v1/modules/users/models/user.model.js';
import Product from '../api/v1/modules/products/models/product.model.js';
import Order, { ORDER_STATUS, PAYMENT_STATUS } from '../api/v1/modules/orders/models/order.model.js';
import OrderItem from '../api/v1/modules/orders/models/orderItem.model.js';

let associationsConfigured = false;

/**
 * Configure and link Sequelize model associations
 */
export function setupAssociations() {
  if (associationsConfigured) return;

  // 1. User <-> Order (One-to-Many)
  User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // 2. Order <-> OrderItem (One-to-Many with Cascade)
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  // 3. Product <-> OrderItem (One-to-Many)
  Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  associationsConfigured = true;
  console.log('[Associations]: Model relationships initialized successfully.');
}

/**
 * Synchronizes database schema with PostgreSQL with comprehensive try/catch
 */
export async function syncDatabase(options = { alter: true }) {
  try {
    setupAssociations();
    await sequelize.sync(options);

    // Apply PostgreSQL raw CHECK constraint on product stock for bulletproof DB-level defense
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'check_product_stock_non_negative'
        ) THEN
          ALTER TABLE products ADD CONSTRAINT check_product_stock_non_negative CHECK (stock >= 0);
        END IF;
      END $$;
    `);

    console.log('[Database Sync]: Tables and constraints synchronized successfully.');
    return true;
  } catch (error) {
    console.error('[Database Sync Error]: Failed to synchronize tables with PostgreSQL.');
    console.error(`Reason: ${error.message}`);
    if (error.original) {
      console.error(`DB Detail: ${error.original.detail || error.original.message}`);
    }
    throw error;
  }
}

export { User, Product, Order, OrderItem, ORDER_STATUS, PAYMENT_STATUS, sequelize };
