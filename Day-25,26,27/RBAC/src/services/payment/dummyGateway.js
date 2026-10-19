const { isValidAmount } = require('@utils/money');
const { generateTransactionNumber } = require('@utils/orderNumber');

const dummyGateway = {
  /**
   * Simulates charging a payment method.
   * @param {Object} params
   * @param {number|bigint} params.amount - Amount in minor units
   * @param {string} [params.method] - Payment method (e.g., 'card', 'upi')
   * @returns {Promise<{ success: boolean, reference: string }>}
   */
  async charge({ amount, method = 'dummy_card' } = {}) {
    if (!isValidAmount(amount)) {
      return {
        success: false,
        reference: null,
        error: 'Invalid payment amount'
      };
    }

    const reference = `PAY-${generateTransactionNumber()}`;
    return {
      success: true,
      reference,
      method
    };
  }
};

module.exports = dummyGateway;
