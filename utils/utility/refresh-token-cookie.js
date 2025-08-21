// utils/utilty/refresh-token-cookie.js

const MAX_AGE = 7 * 24 * 60 * 1000

function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "strict",
    maxAge: MAX_AGE,
  });
}

module.exports = { setRefreshTokenCookie, MAX_AGE };
