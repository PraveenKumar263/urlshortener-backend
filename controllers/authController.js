// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUNDS, SECRET_KEY, EMAIL_ID, FRONTEND_URL } = require('../utils/config');
const transporter = require('../utils/emailSender');
const randomstring = require('randomstring');

const authController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Generate activation token and expiry
            const activationToken = randomstring.generate(20);
            const activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day

            // Create and save new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                activationToken,
                activationTokenExpiry
            });
            await newUser.save();
            
            // Activation link
            const activateLink = `${FRONTEND_URL}/activateAccount?token=${activationToken}`;

            // Send activation email
            const mailOptions = {
                from: EMAIL_ID,
                to: email,
                subject: 'Activate Account',
                text: `Please use the following link to activate your account: ${activateLink}`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email', error });
                }
                return res.json({ message: 'Account activation link sent successfully' });
            });

            return res.status(201).json({ message: 'User created successfully. Please activate your account.' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
        }
    },
    activate: async (req, res) => {
        try {
            const { token } = req.query;

            // Find user by activation token
            const user = await User.findOne({ 
                activationToken: token,
                activationTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired activation token' });
            }

            // Activate account and clear token
            await User.updateOne(
                { _id: user._id },
                { 
                    $set: { 
                        isActive: true, 
                        activationToken: "", 
                        activationTokenExpiry: null 
                    }
                }
            );

            return res.status(200).json({ message: 'Account activated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Check if account is activated
            if (!user.isActive) {
                return res.status(401).json({ message: 'User account is not activated' });
            }

            // Compare password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                SECRET_KEY, { expiresIn: '1h' }
            );
            
            // store the token in the cookie
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
   
            return res.json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
        }
    },
    forgot: async (req, res) => {
        try {
            const { email } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Generate reset link and expiry timestamp
            const resetToken = randomstring.generate(20);
            const expiryTimeStamp = Date.now() + 60 * 60 * 1000; // 1 hour

            // Store reset token and expiry timestamp
            await User.updateOne(
                { email },
                { $set: { resetToken, resetTokenExpiry: expiryTimeStamp } }
            );

            // Create reset link
            const resetLink = `${FRONTEND_URL}/resetPassword?token=${resetToken}&expires=${expiryTimeStamp}`;

            // Send reset link via email
            const mailOptions = {
                from: EMAIL_ID,
                to: user.email,
                subject: 'Reset Password',
                text: `Please use the following link to reset your password: ${resetLink}`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email', error });
                }
                return res.json({ message: 'Reset link sent successfully' });
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    },
    reset: async (req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            // Verify reset token and expiry
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Reset link has expired or is invalid' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

            // Update password and clear reset token
            await User.updateOne(
                { resetToken: token },
                { $set: { password: hashedPassword, resetToken: null, resetTokenExpiry: null } }
            );

            return res.json({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token').json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;
