const crypto = require('crypto');

function formatDateComponent(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function randomHex(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
}

function generateOrderNumber() {
  return `ORD-${formatDateComponent()}-${randomHex(6)}`;
}

function generateInvoiceNumber() {
  return `INV-${formatDateComponent()}-${randomHex(6)}`;
}

function generateTransactionNumber() {
  return `TXN-${formatDateComponent()}-${randomHex(6)}`;
}

function generateTicketNumber() {
  return `TKT-${formatDateComponent()}-${randomHex(6)}`;
}

module.exports = {
  generateOrderNumber,
  generateInvoiceNumber,
  generateTransactionNumber,
  generateTicketNumber
};
