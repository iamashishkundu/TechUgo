const { Op } = require('sequelize');
const { models } = require('@db');

const { WalletEntry } = models;

module.exports = async function walletReport({ from, to } = {}) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(from);
    if (to) where.createdAt[Op.lte] = new Date(to);
  }

  const entries = await WalletEntry.findAll({
    where,
    attributes: ['id', 'type', 'amount', 'source', 'createdAt']
  });

  let totalCredits = 0;
  let totalDebits = 0;
  const breakdownBySource = {};

  for (const e of entries) {
    const amt = Number(e.amount) || 0;
    if (e.type === 'credit') {
      totalCredits += amt;
    } else {
      totalDebits += amt;
    }

    if (!breakdownBySource[e.source]) {
      breakdownBySource[e.source] = { count: 0, amount: 0 };
    }
    breakdownBySource[e.source].count += 1;
    breakdownBySource[e.source].amount += amt;
  }

  return {
    period: { from: from || null, to: to || null },
    totalEntries: entries.length,
    totalCredits,
    totalDebits,
    netChange: totalCredits - totalDebits,
    breakdownBySource
  };
};
