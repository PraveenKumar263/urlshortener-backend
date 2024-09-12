const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const User = require('../models/user');

const auth = {
    verifyToken: async (req, res, next) => {
        try {
            // Get the token from the cookie
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            try {
                // Verify the token
                const decodedToken = jwt.verify(token, JWT_SECRET);

                // Attach the user id to the request object
                req.userId = decodedToken.id;

                // Call the next middleware
                next();
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    isAdmin: async (req, res, next) => {
        try {
            // Get the user id from the request object
            const userId = req.userId;

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Call the next middleware
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = auth;