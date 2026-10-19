const logger = require('@config/logger');

const mailerService = {
  /**
   * Dummy mail sender: logs recipient, subject, and content/token to winston logger.
   * @param {Object} options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Email plain text content
   * @param {string} [options.token] - Verification or reset token (for dev/debugging)
   */
  async sendEmail({ to, subject, text, token = null }) {
    logger.info('[DUMMY MAILER] To: %s | Subject: %s | Body: %s | Token: %s', to, subject, text, token);
    return true;
  }
};

module.exports = mailerService;
