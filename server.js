const express = require('express');
const mongoose = require('mongoose'); // MongoDB
const dotenv = require('dotenv'); // .env file parser
const helmet = require('helmet'); // Secure HTTP headers
const cors = require('cors'); // Cross-origin resource sharing
const authRoutes = require('./routes/authRoutes');
const entryRoutes = require('./routes/entryRoutes');
const rateLimiter = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(rateLimiter); // Apply rate limiting

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB 🟢');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});