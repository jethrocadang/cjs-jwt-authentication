// controllers/auth.controllers.js

const bycrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("../services/token-service");

exports.login = async (req, res) => {
  try {
    // Destructure email and password
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    // Check if the password is correct
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid Password!" });

    // If all checks passed:
    // Save login time.
    user.lastLoginAt = new Date();
    user.save();

    // Sign JWT for the user
    const accessToken = jwt.signAccessToken(user);
    const refreshToken = jwt.signRefreshToken(user);

    // Send the refresh token through yummy HTTP-only cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send back the user info!
    res.json({
      accessToken: accessToken,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    // Catch for any error!
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered!" });

    const hashed = bycrypt.hash(password, 12);
    const user = await User.create({firstName, lastName, email, password:hashed})
  } catch (error) {}
};
