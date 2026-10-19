const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { models, sequelize } = require('@db');
const { randomToken, hashToken } = require('@utils/crypto');
const env = require('@config/env');
const ApiError = require('@utils/ApiError');

const { RefreshToken } = models;

const sessionService = {
  /**
   * Creates a new session and refresh token family for an actor.
   */
  async createSession({ actorType, actorId, userAgent = null, ip = null }, { transaction } = {}) {
    const rawRefreshToken = randomToken(64);
    const tokenHash = hashToken(rawRefreshToken);
    const familyId = uuidv4();
    const expiresAt = new Date(Date.now() + env.REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create(
      {
        actorType,
        actorId,
        tokenHash,
        familyId,
        userAgent,
        ip,
        expiresAt,
        revokedAt: null,
        replacedById: null
      },
      { transaction }
    );

    return {
      refreshToken: rawRefreshToken,
      familyId
    };
  },

  /**
   * Rotates a refresh token with automatic reuse detection.
   */
  async rotateRefreshToken({ rawRefreshToken, userAgent = null, ip = null }) {
    if (!rawRefreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const existing = await RefreshToken.findOne({ where: { tokenHash } });

    if (!existing) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Reuse detection: If token was already revoked, revoke the entire family immediately
    if (existing.revokedAt) {
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { familyId: existing.familyId, revokedAt: null } }
      );
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Check expiration
    if (new Date() > new Date(existing.expiresAt)) {
      await existing.update({ revokedAt: new Date() });
      throw ApiError.unauthorized('Refresh token has expired');
    }

    return await sequelize.transaction(async (t) => {
      const newRawRefreshToken = randomToken(64);
      const newTokenHash = hashToken(newRawRefreshToken);
      const expiresAt = new Date(Date.now() + env.REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);

      const newToken = await RefreshToken.create(
        {
          actorType: existing.actorType,
          actorId: existing.actorId,
          tokenHash: newTokenHash,
          familyId: existing.familyId,
          userAgent: userAgent || existing.userAgent,
          ip: ip || existing.ip,
          expiresAt,
          revokedAt: null,
          replacedById: null
        },
        { transaction: t }
      );

      await existing.update(
        {
          revokedAt: new Date(),
          replacedById: newToken.id
        },
        { transaction: t }
      );

      return {
        refreshToken: newRawRefreshToken,
        familyId: existing.familyId,
        actorType: existing.actorType,
        actorId: existing.actorId
      };
    });
  },

  /**
   * Checks if a session family is currently active (has at least one unrevoked, unexpired token).
   */
  async isSessionActive(familyId) {
    if (!familyId) return false;
    const activeToken = await RefreshToken.findOne({
      where: {
        familyId,
        revokedAt: null,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });
    return !!activeToken;
  },

  /**
   * Revokes a session family (e.g. single logout).
   */
  async revokeFamily(familyId, { transaction } = {}) {
    if (!familyId) return;
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { familyId, revokedAt: null }, transaction }
    );
  },

  /**
   * Revokes all sessions for an actor (e.g. logoutAll, block, password change, force logout).
   */
  async revokeAllForActor(actorType, actorId, { transaction } = {}) {
    if (!actorType || !actorId) return;
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { actorType, actorId, revokedAt: null }, transaction }
    );
  }
};

module.exports = sessionService;
