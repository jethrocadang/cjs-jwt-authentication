// services/token-service.js

const jwt = require("jsonwebtoken");

const signAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      iss: process.env.BACKEND_URL,
      aud: process.env.FRONTEND_URL,
    },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "15m",
    }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      iss: process.env.BACKEND_URL,
      aud: process.env.FRONTEND_URL,
    },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

const signEmailToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      iss: process.env.BACKEND_URL,
      aud: process.env.FRONTEND_URL,
    },
    process.env.JWT_EMAIL_TOKEN,
    {
      expiresIn: "15m",
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
};

const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.JWT_EMAIL_TOKEN);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  signEmailToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyEmailToken,
};
