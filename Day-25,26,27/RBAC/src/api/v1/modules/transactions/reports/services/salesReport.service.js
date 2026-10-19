const { Op } = require('sequelize');
const { models } = require('@db');

const { Order } = models;

module.exports = async function salesReport({ from, to } = {}) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(from);
    if (to) where.createdAt[Op.lte] = new Date(to);
  }

  const orders = await Order.findAll({
    where,
    attributes: ['id', 'status', 'subtotal', 'discountAmount', 'total', 'createdAt']
  });

  let totalRevenue = 0;
  let totalDiscount = 0;
  const statusCounts = {};

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    if (o.status !== 'cancelled') {
      totalRevenue += Number(o.total) || 0;
      totalDiscount += Number(o.discountAmount) || 0;
    }
  }

  return {
    period: { from: from || null, to: to || null },
    totalOrders: orders.length,
    totalRevenue,
    totalDiscount,
    ordersByStatus: statusCounts
  };
};
