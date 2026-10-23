import { sequelize, syncDatabase, User, Product } from './associations.js';

const DEMO_USERS = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
  },
];

const DEMO_PRODUCTS = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    title: 'Ergonomic Wireless Mouse',
    sku: 'TECH-MSE-001',
    price: 29.99,
    stock: 100, // Plenty of stock
    isActive: true,
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Mechanical Gaming Keyboard (RGB)',
    sku: 'TECH-KBD-002',
    price: 89.99,
    stock: 5, // Limited stock (good for testing concurrency)
    isActive: true,
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    title: '4K Ultra-Wide Curved Monitor 34"',
    sku: 'TECH-MON-003',
    price: 499.99,
    stock: 1, // Only 1 in stock! (Great for race condition & oversell test)
    isActive: true,
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    title: 'USB-C Fast Charging Hub (100W)',
    sku: 'TECH-HUB-004',
    price: 19.99,
    stock: 0, // Out of stock (test immediate rejection)
    isActive: true,
  },
  {
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    title: 'Legacy 720p Webcam (Discontinued)',
    sku: 'TECH-CAM-005',
    price: 15.00,
    stock: 20,
    isActive: false, // Inactive product (test inactive product rejection)
  },
];

/**
 * Seeds initial demo data for testing checkout and ACID transactions
 */
export async function seedDatabase() {
  console.log('[Seeder]: Starting database seed process...');

  try {
    // 1. Sync database schema (force: true recreates fresh tables for testing)
    await syncDatabase({ force: true });
    console.log('[Seeder]: Database tables recreated successfully.');

    // 2. Insert Users
    const createdUsers = await User.bulkCreate(DEMO_USERS, { validate: true });
    console.log(`[Seeder]: Created ${createdUsers.length} demo users.`);

    // 3. Insert Products
    const createdProducts = await Product.bulkCreate(DEMO_PRODUCTS, { validate: true });
    console.log(`[Seeder]: Created ${createdProducts.length} demo products.`);

    console.log('\n================== SEED DATA REFERENCE ==================');
    console.log('DEMO USERS:');
    console.table(
      createdUsers.map((u) => ({
        ID: u.id,
        Name: u.name,
        Email: u.email,
      }))
    );

    console.log('\nDEMO PRODUCTS:');
    console.table(
      createdProducts.map((p) => ({
        ID: p.id,
        SKU: p.sku,
        Title: p.title,
        Price: `$${p.price}`,
        Stock: p.stock,
        Active: p.isActive,
      }))
    );
    console.log('=========================================================\n');
    console.log('[Seeder]: Database seeding completed successfully.');
  } catch (error) {
    console.error('[Seeder Error]: Failed to seed the database.');
    console.error(`Message: ${error.message}`);
    if (error.errors) {
      error.errors.forEach((err) => console.error(` - Validation: ${err.message}`));
    }
    process.exitCode = 1;
  } finally {
    try {
      await sequelize.close();
      console.log('[Seeder]: Database connection closed cleanly.');
    } catch (closeError) {
      console.error('[Seeder]: Error closing DB connection:', closeError.message);
    }
  }
}

// Execute if run directly from CLI (e.g. `npm run seed` or `node src/database/seedData.js`)
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase();
}
