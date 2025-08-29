// middleware/authenticate-middleware.js

// Packages
const { redis } = require("../services/perm-cache");

exports.authenticate = async (req, res, next) => {
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
    
    // Check if it is a valid user
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    // Check if there is a role and if not proceed to permissions.
    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have the required role!" });
    }

    // Check if there is permissions
    if (permissions.length) {
      const userPerms = req.user.permissions || [];
      const hasPermission = permissions.every((p) => userPerms.includes(p));
      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "You do not have the required permissions" });
      }
    }

    next();
  };
};
