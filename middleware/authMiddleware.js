// JWT authentication middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Check if the token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If token does not exist
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route, no token' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized to access this route, token failed' });
    }
};