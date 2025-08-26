// services/session-service.js
const { User, RefreshToken } = require("../models");
const { redis, set } = require("../services/perm-cache");

// Save token to DB + Redis
async function storeRefreshToken(refreshData) {
  const { userId, token, exp, ipAddress, userAgent } = refreshData;

  const expiresAt = new Date(Date.now() + exp * 1000);

  await RefreshToken.create({
    user: userId,
    token,
    ipAddress,
    userAgent,
    expiresAt,
  });

  // Save to Redis with expiry (in seconds)
  await redis.set(`refresh:${userId}`, token, "EX", exp);

  return true;
}

// Validate token against Redis + fallback DB
async function validateRefreshToken(userId, token) {
  // First try Redis (fast)
  let stored = await redis.get(`refresh:${userId}`);

  if (!stored) {
    // Fallback to DB
    const refreshDoc = await RefreshToken.findOne({
      user: userId,
      token, // look for exact match
      expiresAt: { $gt: new Date() }, // not expired
    });

    if (!refreshDoc) return false;

    stored = refreshDoc.token;

    // Repopulate Redis for faster next validation
    const ttlSeconds = Math.floor(
      (refreshDoc.expiresAt.getTime() - Date.now()) / 1000
    );

    if (ttlSeconds > 0) {
      await redis.set(`refresh:${userId}`, stored, "EX", ttlSeconds);
    }
  }

  return stored === token;
}

// Remove token from Redis + DB
async function removeRefreshToken(userId, token) {
  // Remove from Redis
  await redis.del(`refresh:${userId}`);

  // Remove from RefreshToken collection
  await RefreshToken.updateOne(
    { user: userId, token },
    { $set: { revokedAt: new Date() } }
  );
}

module.exports = {
  storeRefreshToken,
  validateRefreshToken,
  removeRefreshToken,
};
