// services/token-service.js

const jwt = require("/jsonwebtoken");

const signAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

const verifyAccessToken = () => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
};

const verifyRefreshToken = () => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
};

const signEmailToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "15m",
  });
};

const verifyEmailToken = () => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
