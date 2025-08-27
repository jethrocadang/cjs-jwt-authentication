// middleware/auth-middleware.js

// Packages
const jwt = require("jsonwebtoken");
const { redis } = require("../services/perm-cache");

// Models
const User = require("../models/user");

exports.protect = async (req, res, next) => {
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

exports.authorize = async ({ roles = [], permissions = [] }) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have the required role!" });
    }

    if (permissions.length) {
      const userPerms = req.user.permissions || [];
      const hasPermission = permissions.every((p) =>
        userPerms.includes(p)
      );
      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "You do not have the required permissions" });
      }
    }

    next();
  };
};
