const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('@config/database');
const env = require('@config/env');

const config = dbConfig[env.NODE_ENV] || dbConfig.development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: config.logging,
  define: config.define,
  pool: config.pool
});

const models = {};

// Load every model in models directory
const modelsDir = path.resolve(__dirname, 'models');
fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith('.model.js'))
  .forEach((file) => {
    const modelDefiner = require(path.join(modelsDir, file));
    const model = modelDefiner(sequelize, DataTypes);
    models[model.name] = model;
  });

// Associations
const {
  User,
  Address,
  Role,
  Admin,
  Module,
  Permission,
  RolePermission,
  AdminPermission,
  RefreshToken,
  AuthToken,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  StockMovement,
  Coupon,
  CouponUsage,
  Cart,
  CartItem,
  Wallet,
  WalletEntry,
  Order,
  OrderItem,
  OrderStatusHistory,
  Transaction,
  Invoice,
  Notification,
  FaqCategory,
  Faq,
  Setting,
  Ticket,
  TicketMessage,
  AuditLog
} = models;

// User & Address
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Admin & Role
Role.hasMany(Admin, { foreignKey: 'roleId', as: 'admins', onDelete: 'RESTRICT' });
Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Admin.belongsTo(Admin, { foreignKey: 'createdById', as: 'createdBy' });

// Role & Permission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions'
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.hasMany(RolePermission, { foreignKey: 'roleId', as: 'rolePermissions', onDelete: 'CASCADE' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Permission.hasMany(RolePermission, { foreignKey: 'permissionId', as: 'rolePermissions', onDelete: 'CASCADE' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'permission' });

// Admin & Permission (Direct Permissions)
Admin.belongsToMany(Permission, {
  through: AdminPermission,
  foreignKey: 'adminId',
  otherKey: 'permissionId',
  as: 'directPermissions'
});
Permission.belongsToMany(Admin, {
  through: AdminPermission,
  foreignKey: 'permissionId',
  otherKey: 'adminId',
  as: 'admins'
});

Admin.hasMany(AdminPermission, { foreignKey: 'adminId', as: 'adminPermissions', onDelete: 'CASCADE' });
AdminPermission.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });
Permission.hasMany(AdminPermission, { foreignKey: 'permissionId', as: 'adminPermissions', onDelete: 'CASCADE' });
AdminPermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'permission' });

// Module & Permission
Module.hasMany(Permission, { foreignKey: 'moduleId', as: 'permissions', onDelete: 'CASCADE' });
Permission.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

// Category
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'RESTRICT' });

// Product & Variant & Image
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductVariant.hasMany(ProductImage, { foreignKey: 'variantId', as: 'images', onDelete: 'SET NULL' });
ProductImage.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Stock Movements
ProductVariant.hasMany(StockMovement, { foreignKey: 'variantId', as: 'stockMovements', onDelete: 'CASCADE' });
StockMovement.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Coupon & CouponUsage
Coupon.hasMany(CouponUsage, { foreignKey: 'couponId', as: 'usages', onDelete: 'CASCADE' });
CouponUsage.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
User.hasMany(CouponUsage, { foreignKey: 'userId', as: 'couponUsages' });
CouponUsage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart & CartItems
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Wallet & WalletEntries
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wallet.hasMany(WalletEntry, { foreignKey: 'walletId', as: 'entries', onDelete: 'CASCADE' });
WalletEntry.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

// Orders, Items, History
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Coupon.hasMany(Order, { foreignKey: 'couponId', as: 'orders' });
Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

Order.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'statusHistory', onDelete: 'CASCADE' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

CouponUsage.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Transactions
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(Transaction, { foreignKey: 'orderId', as: 'transactions' });
Transaction.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
WalletEntry.hasOne(Transaction, { foreignKey: 'walletEntryId', as: 'transaction' });
Transaction.belongsTo(WalletEntry, { foreignKey: 'walletEntryId', as: 'walletEntry' });

// Invoices
Order.hasOne(Invoice, { foreignKey: 'orderId', as: 'invoice', onDelete: 'CASCADE' });
Invoice.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
User.hasMany(Invoice, { foreignKey: 'userId', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// FAQ
FaqCategory.hasMany(Faq, { foreignKey: 'categoryId', as: 'faqs', onDelete: 'CASCADE' });
Faq.belongsTo(FaqCategory, { foreignKey: 'categoryId', as: 'category' });

// Settings
Admin.hasMany(Setting, { foreignKey: 'updatedById', as: 'updatedSettings' });
Setting.belongsTo(Admin, { foreignKey: 'updatedById', as: 'updatedBy' });

// Tickets
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Ticket.hasMany(TicketMessage, { foreignKey: 'ticketId', as: 'messages', onDelete: 'CASCADE' });
TicketMessage.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

module.exports = {
  sequelize,
  Sequelize,
  models
};
