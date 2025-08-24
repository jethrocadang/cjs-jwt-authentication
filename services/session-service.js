// services/session-service.js
const { User, RefreshToken } = require("../models");
const { redis, set } = require("../services/perm-cache");

// Save token to DB + Redis
async function storeRefreshToken(refreshData) {
  const { userId, token, exp, ipAddress, userAgent } = refreshData;

  const expiresAt = new Date(Date.now() + exp * 1000);

  const refreshDoc = RefreshToken.create({
    user: userId,
    token,
    ipAddress,
    userAgent,
    expiresAt,
  });
  // Save to DB
  await User.findByIdAndUpdate(userId, {
    $push: { refreshToken: refreshDoc._id },
  });

  // Save to Redis with expiry (in seconds)
  await set(`refresh:${userId}`, token, "EX", expiresAt);

  return refreshDoc;
}

// Validate token against Redis + fallback DB
async function validateRefreshToken(userId, token) {
  let stored = await redis.get(`refresh:${userId}`);

  if (!stored) {
    // fallback to DB
    const user = await User.findById(userId).select("refreshToken");
    stored = user?.refreshToken;

    // repopulate Redis if valid
    if (stored) {
      await redis.set(`refresh:${userId}`, stored, "EX", 7 * 24 * 60 * 60);
    }
  }

  return stored === token;
}

// Remove token from Redis + DB
async function removeRefreshToken(userId) {
  await redis.del(`refresh:${userId}`);
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
}

module.exports = {
  storeRefreshToken,
  validateRefreshToken,
  removeRefreshToken,
};
