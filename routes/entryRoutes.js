// Routes for CRUD operations on diary entries

const express = require('express');
const router = express.Router();
const { createEntry, getEntries, updateEntry, deleteEntry } = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware');

// All incoming @POST, @GET, @PUT, and @DELETE requests to /api/entries are subject to authentication (JWT) before being passed to the respective functions
// Routes for CRUD operations on diary entries
router.route('/')
    .get(protect, getEntries)
    .post(protect, createEntry);


router.route('/:id')
    .put(protect, updateEntry)
    .delete(protect, deleteEntry);

module.exports = router;