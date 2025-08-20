// services/session-service.js
const User = require("./models/User");
const { redis } = require("../services/perm-cache");

// Save token to DB + Redis
async function storeRefreshToken(userId, token, exp) {
  // Save to DB
  await User.findByIdAndUpdate(userId, { refreshToken: token });

  // Save to Redis with expiry (in seconds)
  await redis.set(`refresh:${userId}`, token, "EX", exp);
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
