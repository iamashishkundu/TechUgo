/**
 * Money utilities:
 * Money is stored as integers in the minor unit (paise/cents) in BIGINT columns. Never floats.
 * API accepts and returns minor units.
 */

function toMinorUnit(amount) {
  if (typeof amount === 'bigint') {
    return Number(amount);
  }
  const parsed = Number(amount);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error('Amount must be a safe integer in minor units');
  }
  return parsed;
}

function isValidAmount(amount) {
  if (typeof amount === 'number') {
    return Number.isSafeInteger(amount) && amount > 0;
  }
  if (typeof amount === 'bigint') {
    return amount > 0n;
  }
  return false;
}

function formatCurrency(amountMinor, currency = 'INR') {
  const units = Number(amountMinor) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency
  }).format(units);
}

module.exports = {
  toMinorUnit,
  isValidAmount,
  formatCurrency
};
