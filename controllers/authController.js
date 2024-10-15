// Handles user registration and login

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Helper function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Provide a second layer of validation in case users bypass frontend checks or make direct API calls
// Validation rules for registration (same as database schema)
exports.validateRegister = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, or dashes'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Validation rules for login 
exports.validateLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required'),
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    next(); // Proceed to the next middleware
};

// @POST /api/auth/register - Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Check if the username is already taken
        user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'Username is already taken' });

        // Create a new user
        user = new User({ username, email, password }); // Password is hashed in the User model
        await user.save();

        // Generate a JWT token
        const token = generateToken(user);
        if (!token) throw new Error('Token generation failed');
        
        res.status(201).json({ message: 'User successfully registered', token, user: { id: user._id, username, email } });
    } catch (err) {
        console.log('Server error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @POST /api/auth/login - Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or user does not exist' });

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Generate a JWT token
        const token = generateToken(user);
        if (!token) throw new Error('Token generation failed');
        
        res.status(200).json({ message: 'User successfully logged-in', token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.log('Server error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};