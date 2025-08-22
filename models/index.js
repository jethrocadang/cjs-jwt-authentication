// models/index.js

const User = require("./user");
const Role = require("./role");
const Permission = require("./permission");
const RefreshToken = require("./refreshToken");

module.exports = {
  User,
  Role,
  Permission,
  RefreshToken,
};
