// controllers/auth.controllers.js

//Packages
const bycrypt = require("bcryptjs");

// Services
const jwtService = require("../services/token-service");
const sendEmail = require("../services/email-service");

// Utilities
const verifyEmailTemplate = require("../utils/templates/verify-email-template");
const {
  setRefreshTokenCookie,
} = require("../utils/utility/refresh-token-cookie");

//Models
const { User } = require("../models");

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
    const accessToken = jwtService.signAccessToken(user);
    const refreshToken = jwtService.signRefreshToken(user);

    // Send the refresh token through yummy HTTP-only cookies
    setRefreshTokenCookie(res, refreshToken);

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

    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered!" });

    // Hash the password salted with 12 characters
    const hashed = await bycrypt.hash(password, 12);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    // Create token for verification of email
    const token = jwtService.signEmailToken(user);
    // Create verify email link
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    // Send the verify email
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Click the link to verify your email: ${link}`,
      html: verifyEmailTemplate({ firstName, link }),
    });

    // Success response
    res.status(201).json({
      message: "User registered successfully. Check your email to verify.",
    });
  } catch (error) {
    // Error response
    console.error("Failed to register user:", error);
    res.status(500).json({ message: "Internal server error!", error: error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    // Get the token from the URL
    const { token } = req.query;

    if (!token) return res.status(404).json({ message: "Token not found!" });

    // Decode the token
    const decoded = jwtService.verifyEmailToken(token);

    // Get the user _id
    const user = await User.findById(decoded.id);
    // Check if exists
    if (!user) return res.status(404).json({ message: "User not found!" });
    // Check if verified
    if (user.verified)
      return res.status(400).json({ message: "User already verfied!" });

    // Set status to verified if all checks passed.
    user.verified = true;
    await user.save();

    //Success response.
    res.json({ message: "Email successfull verified!" });
  } catch (error) {
    //Error response
    console.error(
      "[controllers/auth-controller.js] Email verification failed:",
      error
    );
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.refreshToken = async (req, res) => {
  try {

    // Get the refresh token from the http-only cookies
    const refreshToken = req.cookies?.refreshToken;

    // If the refresh token is not found throw an error
    if (!refreshToken) {
      return res.status(401).json({ message: "Token not found!" });
    }

    // Verify the token through the token service
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    // Check if the decoded token is valid 
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token!" });
    }

    // Create new tokens access and refresh
    const newAccessToken = jwtService.signAccessToken({ _id: decoded.sub });
    const newRefreshToken = jwtService.signRefreshToken({ _id: decoded.sub });

    // Set the refresh token in cookie
    setRefreshTokenCookie(res, newRefreshToken);

    // response with new accessToken
    return res.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      // Remove refresh token from DB
      await RefreshTokenModel.deleteOne({ token: refreshToken });
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
