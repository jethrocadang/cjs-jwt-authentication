//services/authorization-service.js

//Models
const { User } = require("../models/index");

//Services
const cache = require("./perm-cache");

//Key for Redis
const USER_PERMISSION_KEY = (userId) => `user_permissions:${userId}`;

async function getUserPermissions(userId) {
  //Get the permissions from the cached data
  const cached = cache.get(USER_PERMISSION_KEY(userId));
  if (cached) return cached;

  //If not cached, query mongoDB
  const user = await User.findById(userId).populate({
    path: "roles",
    populate: { path: "permissions" },
  });

  // If no user is found return empty permission list.
  if (!user) return [];

  // collect permissions from roles + direct permissions
  const permissions = Set();
  // Loop over each role that the user has to get the permission
  user.role.forEach((role) => {
    (role.permissions || []).forEach((permission) =>
      permissions.add(permission.name)
    );
  });
  // Fallback for direct permission
  (user.permissions || []).forEach((permission) =>
    permissions.add(permission.name)
  );

  //Convert to Array
  const permissionArray = Array.from(permissions);

  // Cache the permission of the user
  await cache.set(USER_PERMISSION_KEY(userId), permissionArray);

  // Return the permission array
  return permissionArray;
}

// Call this to invalidate cache when roles/permissions change
async function invalidateUserCache(userId) {
  await cache.redis.del(USER_PERMISSION_KEY(userId));
}

module.exports = { getUserPermissions, invalidateUserCache };
