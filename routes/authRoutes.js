// Authentication-related routes

const express = require('express');
const router = express.Router();
const { register, login, validateRegister, validateLogin, handleValidationErrors } = require('../controllers/authController');

// All incoming @POST requests to /api/auth are subject to validation and error handling before being passed to the register or login functions
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

module.exports = router;