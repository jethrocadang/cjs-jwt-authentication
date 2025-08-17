// middleware/auth-middle.js

// Packages
const jwt = require("jsonwebtoken");
const { redis } = require("../services/perm-cache");

// Models
const User = require("../models/user");

module.exports.protect = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    // If token exists then get the jwt string
    const token = authHeader.split(" ")[1];

    // Check if the token is not blacklisted
    const blacklisted = redis.sismember("bl_access_token:", token);

    // If blacklisted block the token
    if (blacklisted) {
      return res.status(401).json({ message: "Token is blacklisted!" });
    }

    // If all checked is passed, authorize
    next();
  } catch (error) {}
};
