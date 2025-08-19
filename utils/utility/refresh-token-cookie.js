// utils/utilty/refresh-token-cookie.js

function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "strict",
    maxAge: 7 * 24 * 60 * 1000,
  });
}

module.exports = { setRefreshTokenCookie };
