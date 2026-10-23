# E-Commerce Checkout Engine — Testing & Verification Guide

This guide walks you through setting up PostgreSQL, running the database seeder, starting the server, and executing test scenarios via Postman or cURL.

---

## 1. Prerequisites & Setup

### Step A: Install Dependencies
In your project directory (`c:\Users\ashis\Downloads\Techugo\Day-29\E-Commerce Checkout Engine`):
```bash
npm install
```

### Step B: Configure `.env`
Ensure your PostgreSQL instance is running (via pgAdmin 4 or PostgreSQL service). Make sure the database `ecommerce_checkout_db` exists in pgAdmin. If not, create it:
```sql
CREATE DATABASE ecommerce_checkout_db;
```
Check your credentials in `.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_checkout_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### Step C: Seed Demo Data
Run the seeder to automatically sync tables, create constraints, and insert demo users and products:
```bash
npm run seed
```

### Step D: Start Development Server
```bash
npm run dev
```

---

## 2. Seed Reference IDs for Testing

| Entity | Name / Title | ID (UUID) | Stock | Price |
| :--- | :--- | :--- | :--- | :--- |
| **User** | Alice Johnson | `11111111-1111-4111-8111-111111111111` | - | - |
| **User** | Bob Smith | `22222222-2222-4222-8222-222222222222` | - | - |
| **Product** | Ergonomic Wireless Mouse | `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa` | 100 | $29.99 |
| **Product** | Mechanical Gaming Keyboard | `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb` | 5 | $89.99 |
| **Product** | 4K Ultra-Wide Monitor | `cccccccc-cccc-4ccc-8ccc-cccccccccccc` | 1 | $499.99 |
| **Product** | USB-C Fast Charging Hub | `dddddddd-dddd-4ddd-8ddd-dddddddddddd` | 0 | $19.99 |
| **Product** | Legacy Webcam (Inactive) | `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee` | 20 | $15.00 |

---

## 3. Test Scenarios

### Test Scenario 1: Successful Multi-Product Checkout
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/checkout`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "userId": "11111111-1111-4111-8111-111111111111",
  "items": [
    {
      "productId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "quantity": 2
    },
    {
      "productId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "quantity": 1
    }
  ]
}
```
- **Expected Outcome:**
  - Status: `201 Created`
  - Total calculated using DB prices: `(2 * 29.99) + (1 * 89.99) = $149.97`.
  - Stock for Mouse decremented from `100` &rarr; `98`.
  - Stock for Keyboard decremented from `5` &rarr; `4`.
  - Records inserted into `orders` and `order_items` tables in pgAdmin.

---

### Test Scenario 2: Insufficient Stock & Atomic Rollback
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/checkout`
- **Body:**
```json
{
  "userId": "11111111-1111-4111-8111-111111111111",
  "items": [
    {
      "productId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "quantity": 1
    },
    {
      "productId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      "quantity": 1
    }
  ]
}
```
- **Expected Outcome:**
  - Status: `409 Conflict`
  - Message: `Insufficient stock for product 'USB-C Fast Charging Hub (100W)'. Requested: 1, Available: 0`
  - **Atomicity Verification:** Even though the Mouse had sufficient stock, the entire transaction **rolls back**. The Mouse stock remains unchanged, and zero orders are created.

---

### Test Scenario 3: Concurrent Checkout (Preventing Overselling)
Product `cccccccc-cccc-4ccc-8ccc-cccccccccccc` (4K Monitor) has **only 1 unit in stock**.
If User 1 and User 2 both submit checkouts for `quantity: 1` simultaneously:
- **Transaction 1** acquires the pessimistic lock (`SELECT ... FOR UPDATE`), decrements stock to `0`, and commits.
- **Transaction 2** unblocks, reads the newly updated stock (`0`), detects insufficient stock, and immediately triggers `ROLLBACK` returning `409 Conflict`.
- **Result:** Stock never drops to `-1`. Zero overselling.

---

### Test Scenario 4: Order Cancellation & Inventory Restock
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/orders/<ORDER_ID>/cancel`
- **Expected Outcome:**
  - Status: `200 OK`
  - Order status changes to `CANCELLED`.
  - The stock for all items in that order is atomically restored back into the `products` table.

---

### Test Scenario 5: View Real-Time Products & Orders
- **List Products:** `GET http://localhost:5000/api/v1/products`
- **Get Single Order Receipt:** `GET http://localhost:5000/api/v1/orders/<ORDER_ID>`
- **Customer Order History:** `GET http://localhost:5000/api/v1/orders/user/11111111-1111-4111-8111-111111111111`
