// services/perm-cache.js

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function checkRedisConnection() {
  try {
    const result = await redis.ping();
    console.log("Redis connection successful:", result); // Should print "PONG"
    return true;
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    return false;
  }
}

redis.on("connect", () => {
  console.log("Redis connected!");
});

redis.on("error", (error) => {
  console.error("[services/perm-cache.js]: Redis connection error!", error);
});

// Set cache duration, five minutes
const CACHE_TTL = 60 * 5;

// Get data from redis
const get = async (key) => {
  try {
    // Get raw json data from redis
    const raw = await redis.get(key);
    // Convert json data to javascript object & return null if the the key does not exists
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    // Error response retrun
    console.error(`Redis GET error for key "${key}":`, error);
    return null;
  }
};

// Store data in redis with expiration
const set = async (key, value, ttl = CACHE_TTL) => {
  try {
    // Set the data with the key, convert the data to json, set expiration with the time
    await redis.set(key, JSON.stringify(value), "EX", ttl);
    return true;
  } catch (error) {
    // Return false if failed
    console.error(`Redis SET error for key "${key}":`, error);
    return false;
  }
};

module.exports = { checkRedisConnection, get, set, redis };
