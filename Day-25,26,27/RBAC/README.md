# Role-Based Admin Backend

A production-grade, enterprise-ready Role-Based Access Control (RBAC) backend built with **Node.js**, **Express**, **PostgreSQL**, and **Sequelize (v6)** using CommonJS.

---

## 1. Overview & Architecture

This system supports three distinct actor classes with a unified, robust permission model:
- **`user`**: End-customer who self-registers, manages delivery addresses, browses active catalog products, manages a digital wallet, applies promotional coupons, places atomic orders, and opens support tickets.
- **`admin`**: The single super-administrator possessing global privileges across every module and action without restriction.
- **`subadmin`**: Internal staff members with dynamically assigned roles and fine-grained direct allow/deny permission overrides.

### Strict Dependency Direction
Every feature strictly adheres to unidirectional dependency flow:
```
route → middlewares (authenticate, authorize, validate, auditLogger) → controller → service → models
```
- No circular dependencies.
- Services house all business rules and are flat and reusable across audiences.
- Multi-audience modules (`inventory`, `orders`, `wallet`, `transactions`, `notifications`, `faq`, `settings`, `help`) feature audience-segregated controllers, validations, and routes (`admin/` and `user/`).

---

## 2. Dynamic RBAC Model

Permissions follow the standard `module:action` scheme across 10 assignable modules (`user_management`, `orders`, `transactions`, `wallet`, `inventory`, `notifications`, `faq`, `settings`, `help`, `subadmins`) and 5 actions (`create`, `view`, `update`, `delete`, `export`).

### Effective Permission Resolution
$$\text{Effective Permissions} = (\text{Role Permissions} \cup \text{Direct Allows}) \setminus \text{Direct Denies}$$

**Key Tenet:** Direct `deny` overrides **always win** over role-based grants. The super-admin implicitly bypasses checks and holds all permissions.

---

## 3. Financial & Order Invariants

1. **Integer Money Representation:**
   All monetary amounts are stored strictly as 64-bit integers (`BIGINT`) in minor currency units (e.g., paise for INR). No floating-point rounding errors exist.
2. **Wallet Balance Invariant:**
   Wallet balances change **exclusively** through `creditWallet` and `debitWallet` internal services with row-level locks (`SELECT ... FOR UPDATE`). Every change creates an immutable `WalletEntry` record capturing `balance_after`.
   $$\text{Current Balance} = \sum \text{Credits} - \sum \text{Debits}$$
3. **Atomic `placeOrder` Flow:**
   Checkout executes within a single database transaction:
   - Row-locks involved product variants ordered by primary key (deadlock-free).
   - Validates inventory stock and active status.
   - Calculates totals, applies and re-validates coupons.
   - Row-locks user wallet and asserts sufficient funds.
   - Creates Order, Order Items, and Order Status History (`null → pending`).
   - Deducts variant stock and creates `order` Stock Movement entries.
   - Debits wallet and records transactional ledger entry.
   - Records coupon usage and increments usage count.
   - Issues invoice with immutable customer, address, and item snapshot.
   - Clears cart and applied coupon code.
   - Post-commit: Asynchronously dispatches customer confirmation and low-stock administrative alerts.
4. **Finite State Machine for Orders:**
   Allowed status transitions:
   - `pending` $\rightarrow$ `confirmed` | `cancelled`
   - `confirmed` $\rightarrow$ `shipped` | `cancelled`
   - `shipped` $\rightarrow$ `delivered`
   - `delivered` $\rightarrow$ `returned`
   - `returned` $\rightarrow$ `refunded`
   - `cancelled` and `refunded` are terminal. Any illegal transition returns `409 Conflict`.

---

## 4. Setup and Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14
- **npm** >= 9.0.0

### Environment Configuration
Copy `.env.example` to `.env` and adjust the variables:
```bash
cp .env.example .env
```
Key configuration items:
- `PORT=4000`
- `DB_HOST=127.0.0.1`
- `DB_PORT=5432`
- `DB_NAME=rbac_backend`
- `DB_USER=postgres`
- `DB_PASSWORD=password`
- `JWT_ACCESS_SECRET=your-secure-access-secret`
- `JWT_REFRESH_SECRET=your-secure-refresh-secret`
- `CIPHER_SECRET=32-character-secret-for-aes-256`
- `SUPER_ADMIN_EMAIL=superadmin@example.com`
- `SUPER_ADMIN_PASSWORD=AdminPassword123!`

### Database Initialization
Reset the database, apply all 33 timestamped migrations, and seed default roles, modules, permissions, settings, and super admin:
```bash
npm run db:reset
```

### Running the Server
To start the production server:
```bash
npm run start
```
To run in development mode with automatic restarts:
```bash
npm run dev
```

---

## 5. API Route Map

All API routes are prefixed under `/api/v1`.

### Customer Endpoints
| Area | Method | Path | Description |
|---|---|---|---|
| **Auth** | POST | `/user/auth/register` | Register new user account (creates wallet) |
| | POST | `/user/auth/login` | Login with email and password |
| | POST | `/user/auth/verify-email` | Verify email address |
| | POST | `/user/auth/forgot-password` | Request password reset token |
| | POST | `/user/auth/reset-password` | Reset password using token |
| | POST | `/user/auth/refresh-token` | Refresh access token |
| | POST | `/user/auth/logout` | Revoke session |
| **Profile** | GET | `/user/profile` | View profile details |
| | PATCH | `/user/profile` | Update profile information |
| | POST | `/user/profile/addresses` | Add delivery address |
| | GET | `/user/profile/addresses` | List saved addresses |
| | PATCH | `/user/profile/addresses/:id` | Update address |
| | DELETE | `/user/profile/addresses/:id` | Delete address |
| **Catalog** | GET | `/catalog/categories` | Browse active categories |
| | GET | `/catalog/products` | Browse active products (with `inStock` indicator) |
| | GET | `/catalog/products/:id` | View single active product |
| **Cart & Coupon** | GET | `/cart` | View cart with live price calculation |
| | POST | `/cart/items` | Add variant to cart |
| | PATCH | `/cart/items/:id` | Update item quantity |
| | DELETE | `/cart/items/:id` | Remove item from cart |
| | DELETE | `/cart` | Clear entire cart |
| | GET | `/coupons` | List available coupons |
| | POST | `/coupons/apply` | Apply coupon code to cart |
| | DELETE | `/coupons/apply` | Remove coupon from cart |
| **Orders** | POST | `/orders` | Place atomic order |
| | GET | `/orders` | List user orders |
| | GET | `/orders/:id` | View order details |
| | POST | `/orders/:id/cancel` | Cancel order (self-service refund) |
| **Wallet** | GET | `/wallet` | View wallet balance |
| | POST | `/wallet/top-up` | Top-up wallet via payment gateway |
| | GET | `/wallet/entries` | List transaction ledger entries |
| **Finance** | GET | `/transactions` | List user financial transactions |
| | GET | `/transactions/:id` | View single transaction |
| | GET | `/invoices` | List user order invoices |
| | GET | `/invoices/:id` | View invoice details |
| **Support** | POST | `/help/tickets` | Open support ticket (multipart attachments) |
| | GET | `/help/tickets` | List user support tickets |
| | GET | `/help/tickets/:id` | View ticket details and messages |
| | POST | `/help/tickets/:id/replies` | Reply to ticket |
| | PATCH | `/help/tickets/:id/close` | Close ticket |
| **Notifications** | GET | `/notifications` | List user notifications |
| | GET | `/notifications/unread-count` | Get unread notification count |
| | PATCH | `/notifications/read-all` | Mark all notifications read |
| | PATCH | `/notifications/:id/read` | Mark single notification read |
| **Public** | GET | `/faq` | View FAQs grouped by category |
| | GET | `/settings/public` | View public site configuration |

### Administrative Endpoints
| Area | Method | Path | Required Permission |
|---|---|---|---|
| **Admin Auth** | POST | `/admin/auth/login` | Public |
| | POST | `/admin/auth/refresh-token` | Public |
| | POST | `/admin/auth/logout` | Authenticated Staff |
| | GET | `/admin/profile` | Authenticated Staff |
| | PATCH | `/admin/profile` | Authenticated Staff |
| **Subadmins** | GET | `/admin/subadmin-management/permissions` | `subadmins:view` |
| | POST | `/admin/subadmin-management/roles` | `subadmins:create` |
| | GET | `/admin/subadmin-management/roles` | `subadmins:view` |
| | PATCH | `/admin/subadmin-management/roles/:id` | `subadmins:update` |
| | DELETE | `/admin/subadmin-management/roles/:id` | `subadmins:delete` |
| | POST | `/admin/subadmin-management/subadmins` | `subadmins:create` |
| | GET | `/admin/subadmin-management/subadmins` | `subadmins:view` |
| | PATCH | `/admin/subadmin-management/subadmins/:id` | `subadmins:update` |
| | PATCH | `/admin/subadmin-management/subadmins/:id/permissions` | `subadmins:update` |
| **User Mgmt** | GET | `/admin/user-management/users` | `user_management:view` |
| | GET | `/admin/user-management/users/:id` | `user_management:view` |
| | PATCH | `/admin/user-management/users/:id/block` | `user_management:update` |
| | PATCH | `/admin/user-management/users/:id/unblock` | `user_management:update` |
| | DELETE | `/admin/user-management/users/:id` | `user_management:delete` |
| | POST | `/admin/user-management/users/bulk-action` | `user_management:update` / `delete` |
| **Inventory** | GET/POST | `/admin/inventory/categories` | `inventory:view` / `create` |
| | GET/PATCH/DELETE | `/admin/inventory/categories/:id` | `inventory:view` / `update` / `delete` |
| | GET/POST | `/admin/inventory/products` | `inventory:view` / `create` |
| | GET/PATCH/DELETE | `/admin/inventory/products/:id` | `inventory:view` / `update` / `delete` |
| | POST | `/admin/inventory/products/:id/variants` | `inventory:create` |
| | PATCH/DELETE | `/admin/inventory/products/:id/variants/:varId` | `inventory:update` / `delete` |
| | POST | `/admin/inventory/products/:id/images` | `inventory:update` |
| | DELETE | `/admin/inventory/products/:id/images/:imgId` | `inventory:update` |
| | POST | `/admin/inventory/stock/adjust` | `inventory:update` |
| | GET | `/admin/inventory/stock/movements` | `inventory:view` |
| | GET | `/admin/inventory/stock/low` | `inventory:view` |
| | PATCH | `/admin/inventory/stock/variants/:id/threshold` | `inventory:update` |
| **Orders** | GET | `/admin/orders` | `orders:view` |
| | GET | `/admin/orders/:id` | `orders:view` |
| | PATCH | `/admin/orders/:id/status` | `orders:update` |
| | GET/POST | `/admin/coupons` | `orders:view` / `create` |
| | GET/PATCH/DELETE | `/admin/coupons/:id` | `orders:view` / `update` / `delete` |
| **Finance** | GET | `/admin/wallets` | `wallet:view` |
| | GET | `/admin/wallets/:id` | `wallet:view` |
| | POST | `/admin/wallets/:id/adjust` | `wallet:update` |
| | GET | `/admin/transactions` | `transactions:view` |
| | GET | `/admin/transactions/:id` | `transactions:view` |
| | GET | `/admin/invoices` | `transactions:view` |
| | GET | `/admin/reports/sales` | `transactions:export` |
| | GET | `/admin/reports/wallet` | `transactions:export` |
| | GET | `/admin/reports/transactions` | `transactions:export` |
| **Support** | GET | `/admin/help/tickets` | `help:view` |
| | GET | `/admin/help/tickets/:id` | `help:view` |
| | POST | `/admin/help/tickets/:id/replies` | `help:create` |
| | PATCH | `/admin/help/tickets/:id/status` | `help:update` |
| **System** | GET/PATCH | `/admin/settings` | `settings:view` / `update` |
| | PATCH | `/admin/settings/maintenance` | `settings:update` |
| | GET/POST | `/admin/faq/categories` | `faq:view` / `create` |
| | GET/POST | `/admin/faq` | `faq:view` / `create` |
| | GET | `/admin/audit-logs` | Super Admin / Staff |

---

## 6. Verification and Testing

Execute the complete Newman integration test suite covering admin, user, and subadmin flows:
```bash
npm run test:postman
```
This runs the collections in sequence against the live local server:
1. `postman/collections/v1-admin.postman_collection.json`
2. `postman/collections/v1-user.postman_collection.json`
3. `postman/collections/v1-subadmin.postman_collection.json`
