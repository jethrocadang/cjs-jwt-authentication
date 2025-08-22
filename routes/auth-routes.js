// routes/auth-routes.js

// Packages
const express = require("express");
const router = express.Router();

//Controllers
const authController = require("../controllers/auth-controller");

//Routes
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken)

module.exports = router
