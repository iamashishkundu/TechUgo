const fs = require('fs');
const path = require('path');

const inventory = [
  // Health
  {
    module: "Health & System",
    method: "GET",
    url: "/api/health",
    auth: "Public",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { status: 'ok', uptime } }"
  },
  {
    module: "Health & System",
    method: "GET",
    url: "/api/v1/health",
    auth: "Public",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { status: 'ok', uptime } }"
  },

  // Admin Auth & Sessions
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/login",
    auth: "Public",
    permission: "None",
    body: "{ email: string, password: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken, admin } }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/login/2fa",
    auth: "Public",
    permission: "None",
    body: "{ preAuthToken: string, code: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken, admin } }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/refresh-token",
    auth: "Public",
    permission: "None",
    body: "{ refreshToken: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken } }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/logout",
    auth: "Admin / Subadmin",
    permission: "None",
    body: "{ refreshToken?: string }",
    response: "200 OK: { success: true, message: 'Logged out successfully' }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/logout-all",
    auth: "Admin / Subadmin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'Logged out of all sessions' }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/forgot-password",
    auth: "Public",
    permission: "None",
    body: "{ email: string }",
    response: "200 OK: { success: true, message: 'Reset email sent' }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/reset-password",
    auth: "Public",
    permission: "None",
    body: "{ token: string, password: string }",
    response: "200 OK: { success: true, message: 'Password reset successfully' }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/2fa/setup",
    auth: "Admin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { secret, qrCodeUrl } }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/2fa/enable",
    auth: "Admin",
    permission: "None",
    body: "{ code: string }",
    response: "200 OK: { success: true, data: { recoveryCodes } }"
  },
  {
    module: "Admin Auth",
    method: "POST",
    url: "/api/v1/admin/auth/2fa/disable",
    auth: "Admin",
    permission: "None",
    body: "{ code: string }",
    response: "200 OK: { success: true, message: '2FA disabled' }"
  },

  // Admin Profile & Audit Logs
  {
    module: "Admin Profile",
    method: "GET",
    url: "/api/v1/admin/profile",
    auth: "Admin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { admin } }"
  },
  {
    module: "Admin Profile",
    method: "PATCH",
    url: "/api/v1/admin/profile",
    auth: "Admin",
    permission: "None",
    body: "{ name?: string, phone?: string }",
    response: "200 OK: { success: true, data: { admin } }"
  },
  {
    module: "Admin Profile",
    method: "PATCH",
    url: "/api/v1/admin/profile/change-password",
    auth: "Admin",
    permission: "None",
    body: "{ currentPassword: string, newPassword: string }",
    response: "200 OK: { success: true, message: 'Password changed successfully' }"
  },
  {
    module: "Audit Logs",
    method: "GET",
    url: "/api/v1/admin/audit-logs",
    auth: "Admin / Subadmin",
    permission: "Super Admin or settings:view",
    body: "Query: { page?, limit?, module?, action?, actorType? }",
    response: "200 OK: { success: true, data: { logs, pagination } }"
  },
  {
    module: "Audit Logs",
    method: "GET",
    url: "/api/v1/admin/audit-logs/:auditLogId",
    auth: "Admin / Subadmin",
    permission: "Super Admin or settings:view",
    body: "Params: { auditLogId: UUID }",
    response: "200 OK: { success: true, data: { log } }"
  },

  // Subadmin Self (Auth & Profile)
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/login",
    auth: "Public",
    permission: "None",
    body: "{ email: string, password: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken, subadmin } }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/login/2fa",
    auth: "Public",
    permission: "None",
    body: "{ preAuthToken: string, code: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken, subadmin } }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/refresh-token",
    auth: "Public",
    permission: "None",
    body: "{ refreshToken: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken } }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/logout",
    auth: "Subadmin",
    permission: "None",
    body: "{ refreshToken?: string }",
    response: "200 OK: { success: true, message: 'Logged out successfully' }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/logout-all",
    auth: "Subadmin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'Logged out of all sessions' }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/forgot-password",
    auth: "Public",
    permission: "None",
    body: "{ email: string }",
    response: "200 OK: { success: true, message: 'Reset email sent' }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/reset-password",
    auth: "Public",
    permission: "None",
    body: "{ token: string, password: string }",
    response: "200 OK: { success: true, message: 'Password reset successfully' }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/2fa/setup",
    auth: "Subadmin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { secret, qrCodeUrl } }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/2fa/enable",
    auth: "Subadmin",
    permission: "None",
    body: "{ code: string }",
    response: "200 OK: { success: true, data: { recoveryCodes } }"
  },
  {
    module: "Subadmin Auth",
    method: "POST",
    url: "/api/v1/subadmin/auth/2fa/disable",
    auth: "Subadmin",
    permission: "None",
    body: "{ code: string }",
    response: "200 OK: { success: true, message: '2FA disabled' }"
  },
  {
    module: "Subadmin Profile",
    method: "GET",
    url: "/api/v1/subadmin/profile",
    auth: "Subadmin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Profile",
    method: "PATCH",
    url: "/api/v1/subadmin/profile",
    auth: "Subadmin",
    permission: "None",
    body: "{ name?: string, phone?: string }",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Profile",
    method: "PATCH",
    url: "/api/v1/subadmin/profile/change-password",
    auth: "Subadmin",
    permission: "None",
    body: "{ currentPassword: string, newPassword: string }",
    response: "200 OK: { success: true, message: 'Password changed successfully' }"
  },
  {
    module: "Subadmin Profile",
    method: "GET",
    url: "/api/v1/subadmin/profile/permissions",
    auth: "Subadmin",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { effectivePermissions: string[] } }"
  },

  // User Management (Admin)
  {
    module: "User Management",
    method: "GET",
    url: "/api/v1/admin/user-management/users",
    auth: "Admin / Subadmin",
    permission: "user_management:view",
    body: "Query: { page?, limit?, search?, status?, emailVerified? }",
    response: "200 OK: { success: true, data: { users, pagination } }"
  },
  {
    module: "User Management",
    method: "GET",
    url: "/api/v1/admin/user-management/users/:userId",
    auth: "Admin / Subadmin",
    permission: "user_management:view",
    body: "Params: { userId: UUID }",
    response: "200 OK: { success: true, data: { user } }"
  },
  {
    module: "User Management",
    method: "PATCH",
    url: "/api/v1/admin/user-management/users/:userId",
    auth: "Admin / Subadmin",
    permission: "user_management:update",
    body: "Params: { userId: UUID }, Body: { name?, phone?, status? }",
    response: "200 OK: { success: true, data: { user } }"
  },
  {
    module: "User Management",
    method: "PATCH",
    url: "/api/v1/admin/user-management/users/:userId/block",
    auth: "Admin / Subadmin",
    permission: "user_management:update",
    body: "Params: { userId: UUID }, Body: { reason: string }",
    response: "200 OK: { success: true, message: 'User blocked' }"
  },
  {
    module: "User Management",
    method: "PATCH",
    url: "/api/v1/admin/user-management/users/:userId/unblock",
    auth: "Admin / Subadmin",
    permission: "user_management:update",
    body: "Params: { userId: UUID }",
    response: "200 OK: { success: true, message: 'User unblocked' }"
  },
  {
    module: "User Management",
    method: "DELETE",
    url: "/api/v1/admin/user-management/users/:userId",
    auth: "Admin / Subadmin",
    permission: "user_management:delete",
    body: "Params: { userId: UUID }",
    response: "200 OK: { success: true, message: 'User deleted' }"
  },
  {
    module: "User Management",
    method: "POST",
    url: "/api/v1/admin/user-management/users/bulk-action",
    auth: "Admin / Subadmin",
    permission: "user_management:update",
    body: "{ userIds: UUID[], action: 'block' | 'unblock' | 'delete', reason? }",
    response: "200 OK: { success: true, data: { affectedCount } }"
  },

  // Subadmin & Role Management
  {
    module: "Subadmin Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/subadmins",
    auth: "Admin / Subadmin",
    permission: "Super Admin Only",
    body: "Query: { page?, limit?, search?, roleId?, status? }",
    response: "200 OK: { success: true, data: { subadmins, pagination } }"
  },
  {
    module: "Subadmin Management",
    method: "POST",
    url: "/api/v1/admin/subadmin-management/subadmins",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ name: string, email: string, password: string, phone: string, roleId?: UUID }",
    response: "201 Created: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }, Body: { name?, phone?, roleId? }",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/block",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, message: 'Subadmin blocked' }"
  },
  {
    module: "Subadmin Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/unblock",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, message: 'Subadmin unblocked' }"
  },
  {
    module: "Subadmin Management",
    method: "POST",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/force-logout",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, message: 'Subadmin logged out from all devices' }"
  },
  {
    module: "Subadmin Management",
    method: "PUT",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/permissions",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ permissions: [{ permissionId: UUID, effect: 'allow' | 'deny' }] }",
    response: "200 OK: { success: true, message: 'Permissions updated' }"
  },
  {
    module: "Subadmin Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/permissions",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ permissions: [{ permissionId: UUID, effect: 'allow' | 'deny' }] }",
    response: "200 OK: { success: true, message: 'Permissions updated' }"
  },
  {
    module: "Subadmin Management",
    method: "PUT",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/role",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ roleId: UUID }",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId/role",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ roleId: UUID }",
    response: "200 OK: { success: true, data: { subadmin } }"
  },
  {
    module: "Subadmin Management",
    method: "DELETE",
    url: "/api/v1/admin/subadmin-management/subadmins/:subadminId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, message: 'Subadmin deleted' }"
  },
  {
    module: "Subadmin Management",
    method: "POST",
    url: "/api/v1/admin/subadmin-management/subadmins/bulk-action",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ subadminIds: UUID[], action: 'block' | 'unblock' | 'delete' }",
    response: "200 OK: { success: true, data: { affectedCount } }"
  },

  // Roles & Permissions
  {
    module: "Roles Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/roles",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "None",
    response: "200 OK: { success: true, data: { roles: Role[] } }"
  },
  {
    module: "Roles Management",
    method: "POST",
    url: "/api/v1/admin/subadmin-management/roles",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ name: string, description?: string, permissionIds: UUID[] }",
    response: "201 Created: { success: true, data: { role } }"
  },
  {
    module: "Roles Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/roles/:roleId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { roleId: UUID }",
    response: "200 OK: { success: true, data: { role } }"
  },
  {
    module: "Roles Management",
    method: "PATCH",
    url: "/api/v1/admin/subadmin-management/roles/:roleId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { roleId: UUID }, Body: { name?, description?, permissionIds? }",
    response: "200 OK: { success: true, data: { role } }"
  },
  {
    module: "Roles Management",
    method: "DELETE",
    url: "/api/v1/admin/subadmin-management/roles/:roleId",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { roleId: UUID }",
    response: "200 OK: { success: true, message: 'Role deleted' }"
  },
  {
    module: "Permissions Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/permissions",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "None",
    response: "200 OK: { success: true, data: { permissions: Permission[] } }"
  },
  {
    module: "Permissions Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/permissions/modules",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "None",
    response: "200 OK: { success: true, data: { modules: Module[] } }"
  },
  {
    module: "Permissions Management",
    method: "PUT",
    url: "/api/v1/admin/subadmin-management/permissions/subadmins/:subadminId/role",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }, Body: { roleId: UUID }",
    response: "200 OK: { success: true, message: 'Role assigned' }"
  },
  {
    module: "Permissions Management",
    method: "PUT",
    url: "/api/v1/admin/subadmin-management/permissions/subadmins/:subadminId/permissions",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "{ permissions: [{ permissionId: UUID, effect: 'allow' | 'deny' }] }",
    response: "200 OK: { success: true, message: 'Direct permissions set' }"
  },
  {
    module: "Permissions Management",
    method: "GET",
    url: "/api/v1/admin/subadmin-management/permissions/subadmins/:subadminId/effective",
    auth: "Admin",
    permission: "Super Admin Only",
    body: "Params: { subadminId: UUID }",
    response: "200 OK: { success: true, data: { effectivePermissions: string[] } }"
  },

  // Inventory (Admin & Public Catalog)
  {
    module: "Inventory - Categories",
    method: "GET",
    url: "/api/v1/admin/inventory/categories",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Query: { page?, limit?, search?, isActive?, parentId? }",
    response: "200 OK: { success: true, data: { categories, pagination } }"
  },
  {
    module: "Inventory - Categories",
    method: "POST",
    url: "/api/v1/admin/inventory/categories",
    auth: "Admin / Subadmin",
    permission: "inventory:create",
    body: "{ name: string, slug?: string, parentId?: UUID, description?: string, isActive?: boolean }",
    response: "201 Created: { success: true, data: { category } }"
  },
  {
    module: "Inventory - Categories",
    method: "GET",
    url: "/api/v1/admin/inventory/categories/:categoryId",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Params: { categoryId: UUID }",
    response: "200 OK: { success: true, data: { category } }"
  },
  {
    module: "Inventory - Categories",
    method: "PATCH",
    url: "/api/v1/admin/inventory/categories/:categoryId",
    auth: "Admin / Subadmin",
    permission: "inventory:update",
    body: "Params: { categoryId: UUID }, Body: { name?, description?, isActive? }",
    response: "200 OK: { success: true, data: { category } }"
  },
  {
    module: "Inventory - Categories",
    method: "DELETE",
    url: "/api/v1/admin/inventory/categories/:categoryId",
    auth: "Admin / Subadmin",
    permission: "inventory:delete",
    body: "Params: { categoryId: UUID }",
    response: "200 OK: { success: true, message: 'Category deleted' }"
  },
  {
    module: "Inventory - Products",
    method: "GET",
    url: "/api/v1/admin/inventory/products",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Query: { page?, limit?, search?, categoryId?, isActive? }",
    response: "200 OK: { success: true, data: { products, pagination } }"
  },
  {
    module: "Inventory - Products",
    method: "POST",
    url: "/api/v1/admin/inventory/products",
    auth: "Admin / Subadmin",
    permission: "inventory:create",
    body: "{ name: string, categoryId: UUID, description?: string, variants: [{ sku, price, stock, attributes? }] }",
    response: "201 Created: { success: true, data: { product } }"
  },
  {
    module: "Inventory - Products",
    method: "GET",
    url: "/api/v1/admin/inventory/products/:productId",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Params: { productId: UUID }",
    response: "200 OK: { success: true, data: { product } }"
  },
  {
    module: "Inventory - Products",
    method: "PATCH",
    url: "/api/v1/admin/inventory/products/:productId",
    auth: "Admin / Subadmin",
    permission: "inventory:update",
    body: "Params: { productId: UUID }, Body: { name?, description?, categoryId?, isActive? }",
    response: "200 OK: { success: true, data: { product } }"
  },
  {
    module: "Inventory - Products",
    method: "DELETE",
    url: "/api/v1/admin/inventory/products/:productId",
    auth: "Admin / Subadmin",
    permission: "inventory:delete",
    body: "Params: { productId: UUID }",
    response: "200 OK: { success: true, message: 'Product deleted' }"
  },
  {
    module: "Inventory - Variants",
    method: "POST",
    url: "/api/v1/admin/inventory/products/:productId/variants",
    auth: "Admin / Subadmin",
    permission: "inventory:create",
    body: "{ sku: string, price: number, stock: number, attributes?: object, lowStockThreshold?: number }",
    response: "201 Created: { success: true, data: { variant } }"
  },
  {
    module: "Inventory - Variants",
    method: "PATCH",
    url: "/api/v1/admin/inventory/products/:productId/variants/:variantId",
    auth: "Admin / Subadmin",
    permission: "inventory:update",
    body: "{ price?: number, attributes?: object, isActive?: boolean }",
    response: "200 OK: { success: true, data: { variant } }"
  },
  {
    module: "Inventory - Variants",
    method: "DELETE",
    url: "/api/v1/admin/inventory/products/:productId/variants/:variantId",
    auth: "Admin / Subadmin",
    permission: "inventory:delete",
    body: "Params: { productId: UUID, variantId: UUID }",
    response: "200 OK: { success: true, message: 'Variant deleted' }"
  },
  {
    module: "Inventory - Images",
    method: "POST",
    url: "/api/v1/admin/inventory/products/:productId/images",
    auth: "Admin / Subadmin",
    permission: "inventory:create",
    body: "Multipart: { file: Image, variantId?: UUID, isPrimary?: boolean }",
    response: "201 Created: { success: true, data: { image } }"
  },
  {
    module: "Inventory - Images",
    method: "DELETE",
    url: "/api/v1/admin/inventory/products/:productId/images/:imageId",
    auth: "Admin / Subadmin",
    permission: "inventory:delete",
    body: "Params: { productId: UUID, imageId: UUID }",
    response: "200 OK: { success: true, message: 'Image deleted' }"
  },
  {
    module: "Inventory - Stock",
    method: "POST",
    url: "/api/v1/admin/inventory/stock/adjust",
    auth: "Admin / Subadmin",
    permission: "inventory:update",
    body: "{ variantId: UUID, quantityChange: number, type: 'manual_adjustment' | 'purchase' | 'loss', reason?: string }",
    response: "200 OK: { success: true, data: { variant, movement } }"
  },
  {
    module: "Inventory - Stock",
    method: "GET",
    url: "/api/v1/admin/inventory/stock/movements",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Query: { page?, limit?, variantId?, type?, fromDate?, toDate? }",
    response: "200 OK: { success: true, data: { movements, pagination } }"
  },
  {
    module: "Inventory - Stock",
    method: "GET",
    url: "/api/v1/admin/inventory/stock/low",
    auth: "Admin / Subadmin",
    permission: "inventory:view",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { lowStockVariants, pagination } }"
  },
  {
    module: "Inventory - Stock",
    method: "PATCH",
    url: "/api/v1/admin/inventory/stock/variants/:variantId/threshold",
    auth: "Admin / Subadmin",
    permission: "inventory:update",
    body: "Params: { variantId: UUID }, Body: { lowStockThreshold: number }",
    response: "200 OK: { success: true, data: { variant } }"
  },

  // Public Catalog
  {
    module: "Public Catalog",
    method: "GET",
    url: "/api/v1/catalog/categories",
    auth: "Public",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { categories } }"
  },
  {
    module: "Public Catalog",
    method: "GET",
    url: "/api/v1/catalog/products",
    auth: "Public",
    permission: "None",
    body: "Query: { page?, limit?, search?, categoryId?, minPrice?, maxPrice? }",
    response: "200 OK: { success: true, data: { products, pagination } }"
  },
  {
    module: "Public Catalog",
    method: "GET",
    url: "/api/v1/catalog/products/:productId",
    auth: "Public",
    permission: "None",
    body: "Params: { productId: UUID }",
    response: "200 OK: { success: true, data: { product } }"
  },

  // Coupons (Admin & User)
  {
    module: "Coupons",
    method: "GET",
    url: "/api/v1/admin/coupons",
    auth: "Admin / Subadmin",
    permission: "orders:view",
    body: "Query: { page?, limit?, search?, isActive? }",
    response: "200 OK: { success: true, data: { coupons, pagination } }"
  },
  {
    module: "Coupons",
    method: "POST",
    url: "/api/v1/admin/coupons",
    auth: "Admin / Subadmin",
    permission: "orders:create",
    body: "{ code: string, discountType: 'fixed' | 'percentage', discountValue: number, minOrderValue?: number, maxDiscount?: number, usageLimit?: number, expiresAt?: Date }",
    response: "201 Created: { success: true, data: { coupon } }"
  },
  {
    module: "Coupons",
    method: "GET",
    url: "/api/v1/admin/coupons/:couponId",
    auth: "Admin / Subadmin",
    permission: "orders:view",
    body: "Params: { couponId: UUID }",
    response: "200 OK: { success: true, data: { coupon } }"
  },
  {
    module: "Coupons",
    method: "PATCH",
    url: "/api/v1/admin/coupons/:couponId",
    auth: "Admin / Subadmin",
    permission: "orders:update",
    body: "Params: { couponId: UUID }, Body: { discountValue?, isActive?, usageLimit?, expiresAt? }",
    response: "200 OK: { success: true, data: { coupon } }"
  },
  {
    module: "Coupons",
    method: "DELETE",
    url: "/api/v1/admin/coupons/:couponId",
    auth: "Admin / Subadmin",
    permission: "orders:delete",
    body: "Params: { couponId: UUID }",
    response: "200 OK: { success: true, message: 'Coupon deleted' }"
  },
  {
    module: "Coupons",
    method: "GET",
    url: "/api/v1/coupons",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { coupons: Coupon[] } }"
  },
  {
    module: "Coupons",
    method: "POST",
    url: "/api/v1/coupons/apply",
    auth: "User",
    permission: "None",
    body: "{ code: string }",
    response: "200 OK: { success: true, data: { coupon, discountAmount, newTotal } }"
  },
  {
    module: "Coupons",
    method: "DELETE",
    url: "/api/v1/coupons/apply",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'Coupon removed from cart' }"
  },

  // Cart (User)
  {
    module: "Cart",
    method: "GET",
    url: "/api/v1/cart",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { cart: { items, subtotal, discount, total } } }"
  },
  {
    module: "Cart",
    method: "POST",
    url: "/api/v1/cart/items",
    auth: "User",
    permission: "None",
    body: "{ variantId: UUID, quantity: number }",
    response: "200 OK: { success: true, data: { cart } }"
  },
  {
    module: "Cart",
    method: "PATCH",
    url: "/api/v1/cart/items/:itemId",
    auth: "User",
    permission: "None",
    body: "Params: { itemId: UUID }, Body: { quantity: number }",
    response: "200 OK: { success: true, data: { cart } }"
  },
  {
    module: "Cart",
    method: "DELETE",
    url: "/api/v1/cart/items/:itemId",
    auth: "User",
    permission: "None",
    body: "Params: { itemId: UUID }",
    response: "200 OK: { success: true, message: 'Item removed from cart' }"
  },
  {
    module: "Cart",
    method: "DELETE",
    url: "/api/v1/cart",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'Cart cleared' }"
  },

  // Orders (Admin & User)
  {
    module: "Orders",
    method: "GET",
    url: "/api/v1/admin/orders",
    auth: "Admin / Subadmin",
    permission: "orders:view",
    body: "Query: { page?, limit?, status?, paymentStatus?, search?, fromDate?, toDate? }",
    response: "200 OK: { success: true, data: { orders, pagination } }"
  },
  {
    module: "Orders",
    method: "GET",
    url: "/api/v1/admin/orders/:orderId",
    auth: "Admin / Subadmin",
    permission: "orders:view",
    body: "Params: { orderId: UUID }",
    response: "200 OK: { success: true, data: { order } }"
  },
  {
    module: "Orders",
    method: "PATCH",
    url: "/api/v1/admin/orders/:orderId/status",
    auth: "Admin / Subadmin",
    permission: "orders:update",
    body: "Params: { orderId: UUID }, Body: { status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled', note?: string }",
    response: "200 OK: { success: true, data: { order } }"
  },
  {
    module: "Orders",
    method: "POST",
    url: "/api/v1/orders",
    auth: "User",
    permission: "None",
    body: "{ addressId: UUID }",
    response: "201 Created: { success: true, data: { order, invoice } }"
  },
  {
    module: "Orders",
    method: "GET",
    url: "/api/v1/orders",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit?, status? }",
    response: "200 OK: { success: true, data: { orders, pagination } }"
  },
  {
    module: "Orders",
    method: "GET",
    url: "/api/v1/orders/:orderId",
    auth: "User",
    permission: "None",
    body: "Params: { orderId: UUID }",
    response: "200 OK: { success: true, data: { order } }"
  },
  {
    module: "Orders",
    method: "POST",
    url: "/api/v1/orders/:orderId/cancel",
    auth: "User",
    permission: "None",
    body: "Params: { orderId: UUID }, Body: { reason?: string }",
    response: "200 OK: { success: true, data: { order, refundWalletEntry } }"
  },

  // Wallet & Ledger (Admin & User)
  {
    module: "Wallet & Ledger",
    method: "GET",
    url: "/api/v1/admin/wallets",
    auth: "Admin / Subadmin",
    permission: "wallet:view",
    body: "Query: { page?, limit?, search? }",
    response: "200 OK: { success: true, data: { wallets, pagination } }"
  },
  {
    module: "Wallet & Ledger",
    method: "GET",
    url: "/api/v1/admin/wallets/:walletId",
    auth: "Admin / Subadmin",
    permission: "wallet:view",
    body: "Params: { walletId: UUID }",
    response: "200 OK: { success: true, data: { wallet } }"
  },
  {
    module: "Wallet & Ledger",
    method: "POST",
    url: "/api/v1/admin/wallets/:walletId/adjust",
    auth: "Admin / Subadmin",
    permission: "wallet:update",
    body: "Params: { walletId: UUID }, Body: { amount: number, type: 'credit' | 'debit', reason: string }",
    response: "200 OK: { success: true, data: { wallet, entry } }"
  },
  {
    module: "Wallet & Ledger",
    method: "GET",
    url: "/api/v1/wallet",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { wallet: { balance, currency } } }"
  },
  {
    module: "Wallet & Ledger",
    method: "POST",
    url: "/api/v1/wallet/top-up",
    auth: "User",
    permission: "None",
    body: "{ amount: number }",
    response: "200 OK: { success: true, data: { wallet, transaction } }"
  },
  {
    module: "Wallet & Ledger",
    method: "GET",
    url: "/api/v1/wallet/entries",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { entries, pagination } }"
  },

  // Transactions, Invoices, Reports
  {
    module: "Transactions",
    method: "GET",
    url: "/api/v1/admin/transactions",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Query: { page?, limit?, type?, status?, fromDate?, toDate? }",
    response: "200 OK: { success: true, data: { transactions, pagination } }"
  },
  {
    module: "Transactions",
    method: "GET",
    url: "/api/v1/admin/transactions/:transactionId",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Params: { transactionId: UUID }",
    response: "200 OK: { success: true, data: { transaction } }"
  },
  {
    module: "Transactions",
    method: "GET",
    url: "/api/v1/transactions",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { transactions, pagination } }"
  },
  {
    module: "Transactions",
    method: "GET",
    url: "/api/v1/transactions/:transactionId",
    auth: "User",
    permission: "None",
    body: "Params: { transactionId: UUID }",
    response: "200 OK: { success: true, data: { transaction } }"
  },
  {
    module: "Invoices",
    method: "GET",
    url: "/api/v1/admin/invoices",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Query: { page?, limit?, status? }",
    response: "200 OK: { success: true, data: { invoices, pagination } }"
  },
  {
    module: "Invoices",
    method: "GET",
    url: "/api/v1/admin/invoices/:invoiceId",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Params: { invoiceId: UUID }",
    response: "200 OK: { success: true, data: { invoice } }"
  },
  {
    module: "Invoices",
    method: "GET",
    url: "/api/v1/invoices",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { invoices, pagination } }"
  },
  {
    module: "Invoices",
    method: "GET",
    url: "/api/v1/invoices/:invoiceId",
    auth: "User",
    permission: "None",
    body: "Params: { invoiceId: UUID }",
    response: "200 OK: { success: true, data: { invoice } }"
  },
  {
    module: "Reports",
    method: "GET",
    url: "/api/v1/admin/reports/sales",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Query: { fromDate?, toDate?, interval?: 'day'|'week'|'month' }",
    response: "200 OK: { success: true, data: { salesMetrics } }"
  },
  {
    module: "Reports",
    method: "GET",
    url: "/api/v1/admin/reports/wallet",
    auth: "Admin / Subadmin",
    permission: "wallet:view",
    body: "Query: { fromDate?, toDate? }",
    response: "200 OK: { success: true, data: { walletMetrics } }"
  },
  {
    module: "Reports",
    method: "GET",
    url: "/api/v1/admin/reports/transactions",
    auth: "Admin / Subadmin",
    permission: "transactions:view",
    body: "Query: { fromDate?, toDate?, type? }",
    response: "200 OK: { success: true, data: { transactionMetrics } }"
  },

  // Customer Auth, Profile, Addresses
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/register",
    auth: "Public",
    permission: "None",
    body: "{ fullName: string, email: string, phone: string, password: string }",
    response: "201 Created: { success: true, data: { user, verificationToken } }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/login",
    auth: "Public",
    permission: "None",
    body: "{ email: string, password: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken, user } }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/refresh-token",
    auth: "Public",
    permission: "None",
    body: "{ refreshToken: string }",
    response: "200 OK: { success: true, data: { accessToken, refreshToken } }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/logout",
    auth: "User",
    permission: "None",
    body: "{ refreshToken?: string }",
    response: "200 OK: { success: true, message: 'Logged out successfully' }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/logout-all",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'Logged out of all sessions' }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/verify-email",
    auth: "Public",
    permission: "None",
    body: "{ token: string }",
    response: "200 OK: { success: true, message: 'Email verified successfully' }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/resend-verification",
    auth: "Public",
    permission: "None",
    body: "{ email: string }",
    response: "200 OK: { success: true, message: 'Verification email resent' }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/forgot-password",
    auth: "Public",
    permission: "None",
    body: "{ email: string }",
    response: "200 OK: { success: true, message: 'Reset email sent' }"
  },
  {
    module: "User Auth",
    method: "POST",
    url: "/api/v1/user/auth/reset-password",
    auth: "Public",
    permission: "None",
    body: "{ token: string, password: string }",
    response: "200 OK: { success: true, message: 'Password reset successfully' }"
  },
  {
    module: "User Profile",
    method: "GET",
    url: "/api/v1/user/profile",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { user } }"
  },
  {
    module: "User Profile",
    method: "PATCH",
    url: "/api/v1/user/profile",
    auth: "User",
    permission: "None",
    body: "{ fullName?: string, phone?: string }",
    response: "200 OK: { success: true, data: { user } }"
  },
  {
    module: "User Profile",
    method: "PATCH",
    url: "/api/v1/user/profile/change-password",
    auth: "User",
    permission: "None",
    body: "{ currentPassword: string, newPassword: string }",
    response: "200 OK: { success: true, message: 'Password changed successfully' }"
  },
  {
    module: "User Profile",
    method: "POST",
    url: "/api/v1/user/profile/avatar",
    auth: "User",
    permission: "None",
    body: "Multipart: { file: Image }",
    response: "200 OK: { success: true, data: { avatarUrl } }"
  },
  {
    module: "User Addresses",
    method: "GET",
    url: "/api/v1/user/profile/addresses",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { addresses: Address[] } }"
  },
  {
    module: "User Addresses",
    method: "POST",
    url: "/api/v1/user/profile/addresses",
    auth: "User",
    permission: "None",
    body: "{ label: string, recipientName: string, phone: string, line1: string, line2?: string, city: string, state: string, postalCode: string, country: string, isDefault?: boolean }",
    response: "201 Created: { success: true, data: { address } }"
  },
  {
    module: "User Addresses",
    method: "PATCH",
    url: "/api/v1/user/profile/addresses/:addressId",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }, Body: { recipientName?, phone?, line1?, city?, state?, postalCode? }",
    response: "200 OK: { success: true, data: { address } }"
  },
  {
    module: "User Addresses",
    method: "PATCH",
    url: "/api/v1/user/profile/addresses/:addressId/default",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }",
    response: "200 OK: { success: true, data: { address } }"
  },
  {
    module: "User Addresses",
    method: "DELETE",
    url: "/api/v1/user/profile/addresses/:addressId",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }",
    response: "200 OK: { success: true, message: 'Address deleted' }"
  },
  {
    module: "User Addresses (Alias)",
    method: "GET",
    url: "/api/v1/user/addresses",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { addresses: Address[] } }"
  },
  {
    module: "User Addresses (Alias)",
    method: "POST",
    url: "/api/v1/user/addresses",
    auth: "User",
    permission: "None",
    body: "{ label: string, recipientName: string, phone: string, line1: string, city: string, state: string, postalCode: string, country: string }",
    response: "201 Created: { success: true, data: { address } }"
  },
  {
    module: "User Addresses (Alias)",
    method: "PATCH",
    url: "/api/v1/user/addresses/:addressId",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }",
    response: "200 OK: { success: true, data: { address } }"
  },
  {
    module: "User Addresses (Alias)",
    method: "PATCH",
    url: "/api/v1/user/addresses/:addressId/default",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }",
    response: "200 OK: { success: true, data: { address } }"
  },
  {
    module: "User Addresses (Alias)",
    method: "DELETE",
    url: "/api/v1/user/addresses/:addressId",
    auth: "User",
    permission: "None",
    body: "Params: { addressId: UUID }",
    response: "200 OK: { success: true, message: 'Address deleted' }"
  },

  // Notifications (Admin & User)
  {
    module: "Notifications",
    method: "GET",
    url: "/api/v1/admin/notifications",
    auth: "Admin / Subadmin",
    permission: "notifications:view",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { notifications, pagination } }"
  },
  {
    module: "Notifications",
    method: "POST",
    url: "/api/v1/admin/notifications/broadcast",
    auth: "Admin / Subadmin",
    permission: "notifications:create",
    body: "{ title: string, message: string, targetType: 'all' | 'users' | 'admins' }",
    response: "201 Created: { success: true, message: 'Broadcast sent' }"
  },
  {
    module: "Notifications",
    method: "PATCH",
    url: "/api/v1/admin/notifications/read-all",
    auth: "Admin / Subadmin",
    permission: "notifications:update",
    body: "None",
    response: "200 OK: { success: true, message: 'All marked as read' }"
  },
  {
    module: "Notifications",
    method: "PATCH",
    url: "/api/v1/admin/notifications/:notificationId/read",
    auth: "Admin / Subadmin",
    permission: "notifications:update",
    body: "Params: { notificationId: UUID }",
    response: "200 OK: { success: true, message: 'Notification marked as read' }"
  },
  {
    module: "Notifications",
    method: "GET",
    url: "/api/v1/notifications",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit? }",
    response: "200 OK: { success: true, data: { notifications, pagination } }"
  },
  {
    module: "Notifications",
    method: "GET",
    url: "/api/v1/notifications/unread-count",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { count: number } }"
  },
  {
    module: "Notifications",
    method: "PATCH",
    url: "/api/v1/notifications/read-all",
    auth: "User",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, message: 'All notifications marked as read' }"
  },
  {
    module: "Notifications",
    method: "PATCH",
    url: "/api/v1/notifications/:notificationId/read",
    auth: "User",
    permission: "None",
    body: "Params: { notificationId: UUID }",
    response: "200 OK: { success: true, message: 'Notification marked as read' }"
  },

  // FAQ (Admin & Public)
  {
    module: "FAQ Categories",
    method: "GET",
    url: "/api/v1/admin/faq/categories",
    auth: "Admin / Subadmin",
    permission: "faq:view",
    body: "None",
    response: "200 OK: { success: true, data: { categories } }"
  },
  {
    module: "FAQ Categories",
    method: "POST",
    url: "/api/v1/admin/faq/categories",
    auth: "Admin / Subadmin",
    permission: "faq:create",
    body: "{ name: string, order?: number }",
    response: "201 Created: { success: true, data: { category } }"
  },
  {
    module: "FAQ Categories",
    method: "PATCH",
    url: "/api/v1/admin/faq/categories/:categoryId",
    auth: "Admin / Subadmin",
    permission: "faq:update",
    body: "Params: { categoryId: UUID }, Body: { name?, order? }",
    response: "200 OK: { success: true, data: { category } }"
  },
  {
    module: "FAQ Categories",
    method: "DELETE",
    url: "/api/v1/admin/faq/categories/:categoryId",
    auth: "Admin / Subadmin",
    permission: "faq:delete",
    body: "Params: { categoryId: UUID }",
    response: "200 OK: { success: true, message: 'FAQ Category deleted' }"
  },
  {
    module: "FAQ",
    method: "GET",
    url: "/api/v1/admin/faq",
    auth: "Admin / Subadmin",
    permission: "faq:view",
    body: "Query: { page?, limit?, categoryId?, isActive? }",
    response: "200 OK: { success: true, data: { faqs, pagination } }"
  },
  {
    module: "FAQ",
    method: "POST",
    url: "/api/v1/admin/faq",
    auth: "Admin / Subadmin",
    permission: "faq:create",
    body: "{ categoryId: UUID, question: string, answer: string, order?: number, isActive?: boolean }",
    response: "201 Created: { success: true, data: { faq } }"
  },
  {
    module: "FAQ",
    method: "PUT",
    url: "/api/v1/admin/faq/reorder",
    auth: "Admin / Subadmin",
    permission: "faq:update",
    body: "{ faqOrder: [{ id: UUID, order: number }] }",
    response: "200 OK: { success: true, message: 'FAQs reordered' }"
  },
  {
    module: "FAQ",
    method: "PATCH",
    url: "/api/v1/admin/faq/:faqId",
    auth: "Admin / Subadmin",
    permission: "faq:update",
    body: "Params: { faqId: UUID }, Body: { question?, answer?, categoryId? }",
    response: "200 OK: { success: true, data: { faq } }"
  },
  {
    module: "FAQ",
    method: "PATCH",
    url: "/api/v1/admin/faq/:faqId/status",
    auth: "Admin / Subadmin",
    permission: "faq:update",
    body: "Params: { faqId: UUID }, Body: { isActive: boolean }",
    response: "200 OK: { success: true, data: { faq } }"
  },
  {
    module: "FAQ",
    method: "DELETE",
    url: "/api/v1/admin/faq/:faqId",
    auth: "Admin / Subadmin",
    permission: "faq:delete",
    body: "Params: { faqId: UUID }",
    response: "200 OK: { success: true, message: 'FAQ deleted' }"
  },
  {
    module: "FAQ",
    method: "GET",
    url: "/api/v1/faq",
    auth: "Public",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { faqs } }"
  },

  // Settings
  {
    module: "Settings",
    method: "GET",
    url: "/api/v1/admin/settings",
    auth: "Admin / Subadmin",
    permission: "settings:view",
    body: "None",
    response: "200 OK: { success: true, data: { settings: Setting[] } }"
  },
  {
    module: "Settings",
    method: "PATCH",
    url: "/api/v1/admin/settings",
    auth: "Admin / Subadmin",
    permission: "settings:update",
    body: "{ settings: [{ key: string, value: any }] }",
    response: "200 OK: { success: true, data: { updatedSettings } }"
  },
  {
    module: "Settings",
    method: "PATCH",
    url: "/api/v1/admin/settings/maintenance",
    auth: "Admin / Subadmin",
    permission: "settings:update",
    body: "{ enabled: boolean, message?: string }",
    response: "200 OK: { success: true, data: { maintenanceMode: boolean } }"
  },
  {
    module: "Settings",
    method: "GET",
    url: "/api/v1/settings/public",
    auth: "Public",
    permission: "None",
    body: "None",
    response: "200 OK: { success: true, data: { publicSettings } }"
  },

  // Help Desk / Support Tickets
  {
    module: "Help Desk",
    method: "GET",
    url: "/api/v1/admin/help/tickets",
    auth: "Admin / Subadmin",
    permission: "help:view",
    body: "Query: { page?, limit?, status?, priority?, userId? }",
    response: "200 OK: { success: true, data: { tickets, pagination } }"
  },
  {
    module: "Help Desk",
    method: "GET",
    url: "/api/v1/admin/help/tickets/:ticketId",
    auth: "Admin / Subadmin",
    permission: "help:view",
    body: "Params: { ticketId: UUID }",
    response: "200 OK: { success: true, data: { ticket, messages } }"
  },
  {
    module: "Help Desk",
    method: "POST",
    url: "/api/v1/admin/help/tickets/:ticketId/replies",
    auth: "Admin / Subadmin",
    permission: "help:update",
    body: "Params: { ticketId: UUID }, Body: { message: string }",
    response: "201 Created: { success: true, data: { reply } }"
  },
  {
    module: "Help Desk",
    method: "PATCH",
    url: "/api/v1/admin/help/tickets/:ticketId/status",
    auth: "Admin / Subadmin",
    permission: "help:update",
    body: "Params: { ticketId: UUID }, Body: { status: 'open' | 'in_progress' | 'resolved' | 'closed' }",
    response: "200 OK: { success: true, data: { ticket } }"
  },
  {
    module: "Help Desk",
    method: "GET",
    url: "/api/v1/help/tickets",
    auth: "User",
    permission: "None",
    body: "Query: { page?, limit?, status? }",
    response: "200 OK: { success: true, data: { tickets, pagination } }"
  },
  {
    module: "Help Desk",
    method: "POST",
    url: "/api/v1/help/tickets",
    auth: "User",
    permission: "None",
    body: "{ subject: string, message: string, priority?: 'low' | 'medium' | 'high' }",
    response: "201 Created: { success: true, data: { ticket } }"
  },
  {
    module: "Help Desk",
    method: "GET",
    url: "/api/v1/help/tickets/:ticketId",
    auth: "User",
    permission: "None",
    body: "Params: { ticketId: UUID }",
    response: "200 OK: { success: true, data: { ticket, messages } }"
  },
  {
    module: "Help Desk",
    method: "POST",
    url: "/api/v1/help/tickets/:ticketId/replies",
    auth: "User",
    permission: "None",
    body: "Params: { ticketId: UUID }, Body: { message: string }",
    response: "201 Created: { success: true, data: { reply } }"
  },
  {
    module: "Help Desk",
    method: "PATCH",
    url: "/api/v1/help/tickets/:ticketId/close",
    auth: "User",
    permission: "None",
    body: "Params: { ticketId: UUID }",
    response: "200 OK: { success: true, data: { ticket } }"
  }
];

// Generate markdown
let md = `# Complete API Inventory (All 175 Endpoints)

> **Total Registered Endpoints:** ${inventory.length}  
> **Standard Response Format:** All responses conform to the structured format:  
> \`{ success: boolean, message?: string, code?: string, data?: object, errors?: array }\`

---

`;

const modulesGrouped = {};
inventory.forEach(item => {
  if (!modulesGrouped[item.module]) modulesGrouped[item.module] = [];
  modulesGrouped[item.module].push(item);
});

for (const [mod, items] of Object.entries(modulesGrouped)) {
  md += `## Module: ${mod}\n\n`;
  md += `| Method | Endpoint URL | Auth Actor | Required Permission | Request Payload / Params | Expected Response |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  items.forEach(it => {
    md += `| \`${it.method}\` | \`${it.url}\` | ${it.auth} | \`${it.permission}\` | \`${it.body}\` | ${it.response} |\n`;
  });
  md += `\n`;
}

const artifactPath = 'C:\\\\Users\\\\ashis\\\\.gemini\\\\antigravity\\\\brain\\\\1dfba81d-6497-48a3-b7cd-9d4edb6d1a2e\\\\api_inventory_complete.md';
fs.writeFileSync(artifactPath, md, 'utf8');
console.log('Artifact written to:', artifactPath);
