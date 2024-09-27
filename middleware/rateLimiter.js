// Rate limiting middleware to prevent abuse - 100 requests per 15 minutes

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    headers: true,
});

module.exports = rateLimiter;