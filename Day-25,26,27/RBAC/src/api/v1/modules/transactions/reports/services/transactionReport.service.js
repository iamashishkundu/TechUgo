const { Op } = require('sequelize');
const { models } = require('@db');

const { Transaction } = models;

module.exports = async function transactionReport({ from, to } = {}) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(from);
    if (to) where.createdAt[Op.lte] = new Date(to);
  }

  const transactions = await Transaction.findAll({
    where,
    attributes: ['id', 'type', 'direction', 'amount', 'status', 'createdAt']
  });

  let totalVolume = 0;
  const statusCounts = { success: 0, failed: 0 };
  const typeBreakdown = {};

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.status === 'success') {
      totalVolume += amt;
      statusCounts.success += 1;
    } else {
      statusCounts.failed = (statusCounts.failed || 0) + 1;
    }

    if (!typeBreakdown[t.type]) {
      typeBreakdown[t.type] = { count: 0, amount: 0 };
    }
    typeBreakdown[t.type].count += 1;
    typeBreakdown[t.type].amount += amt;
  }

  return {
    period: { from: from || null, to: to || null },
    totalTransactions: transactions.length,
    totalVolume,
    statusCounts,
    typeBreakdown
  };
};
