//services/authorization-service.js

//Models
const { User, Role, Permission } = require("../models/index");

//Services
const cache = require("../services/perm-cache");

//Key for Redis
const USE_PERM_KEY = (userId) => `user_perms:${userId}`;

async function getUserPermissions(userId) {
  //Get the cached data
  const cached = cache.get(USE_PERM_KEY(userId));
  if (cached) return cached;

  //If not cached
  const user = await User.findById(userId).populate({
    path: "roles",
    populate: { path: "permissions" },
  });

  if (!user) return [];

  // collect permissions from roles + direct permissions
  const perms = new Set();
  user.roles.forEach((r) => {
    (r.permissions || []).forEach((p) => perms.add(p.name));
  });
  (user.permissions || []).forEach((p) => perms.add(p.name));

  const arr = Array.from(perms);
  await cache.set(USER_PERM_KEY(userId), arr);
  return arr;
}

// Call this to invalidate cache when roles/permissions change
async function invalidateUserCache(userId) {
  await cache.redis.del(USER_PERM_KEY(userId));
}

module.exports = { getUserPermissions, invalidateUserCache };
