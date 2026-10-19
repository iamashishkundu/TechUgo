const { models } = require('@db');
const { randomToken, hashToken } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { AuthToken } = models;

const authTokenService = {
  /**
   * Creates an auth token for email verification or password reset.
   * Inactivates previous unused tokens for the same actor and purpose.
   */
  async createToken({ actorType, actorId, purpose, expiryHours = 24 }, { transaction } = {}) {
    const rawToken = randomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // Invalidate prior unused tokens of this purpose for this actor
    await AuthToken.update(
      { usedAt: new Date() },
      {
        where: {
          actorType,
          actorId,
          purpose,
          usedAt: null
        },
        transaction
      }
    );

    await AuthToken.create(
      {
        actorType,
        actorId,
        purpose,
        tokenHash,
        expiresAt,
        usedAt: null
      },
      { transaction }
    );

    return { rawToken, expiresAt };
  },

  /**
   * Verifies an auth token and marks it as used.
   */
  async verifyAndConsumeToken({ rawToken, purpose }, { transaction } = {}) {
    if (!rawToken) {
      throw ApiError.badRequest('Token is required');
    }

    const tokenHash = hashToken(rawToken);
    const authToken = await AuthToken.findOne({
      where: {
        tokenHash,
        purpose
      },
      transaction
    });

    if (!authToken) {
      throw ApiError.badRequest('Invalid or expired token');
    }

    if (authToken.usedAt) {
      throw ApiError.badRequest('Token has already been used');
    }

    if (new Date() > new Date(authToken.expiresAt)) {
      throw ApiError.badRequest('Token has expired');
    }

    await authToken.update({ usedAt: new Date() }, { transaction });

    return {
      actorType: authToken.actorType,
      actorId: authToken.actorId
    };
  }
};

module.exports = authTokenService;
