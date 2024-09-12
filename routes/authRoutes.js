const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router();
const auth = require('../utils/auth');

// Register a new user
authRouter.post('/register', authController.register);

// Activate user account
authRouter.put('/activate', authController.activate);

// Verify login of a user
authRouter.put('/login', authController.login);

// Forgot password
authRouter.put('/forgot', authController.forgot);

// Reset password
authRouter.put('/reset/:token', authController.reset);

// User logout
authRouter.put('/logout', auth.verifyToken, authController.logout);

module.exports = authRouter;
