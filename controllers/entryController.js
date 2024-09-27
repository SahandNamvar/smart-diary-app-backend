// Handles CRUD operations for diary entries

const DiaryEntry = require('../models/DiaryEntry');
const googleNLPController = require('./googleNLPController');
const gptResponseController = require('./gptResponseController');

// @POST /api/entries - Create a new diary entry
exports.createEntry = async (req, res) => {
    const { text_entry } = req.body;

    try {
        // Analyze sentiment of the entry using Google NLP
        const sentiment = await googleNLPController.analyzeSentiment(text_entry); // Async call because it's a network request

        // Generate a response using GPT-3
        const auto_response = await gptResponseController.generateResponse({ text_entry, sentiment });

        // Create a new diary entry
        const entry = new DiaryEntry({
            user_id: req.user._id,
            text_entry: text_entry,
            auto_response: auto_response,
            sentiment_score: sentiment.score,
            sentiment_magnitude: sentiment.magnitude,
        });
        await entry.save();

        res.status(201).json({ entry });
        
    } catch (err) {
        console.log('Failed to create entry:', err.message);
        res.status(500).json({ message: 'Failed to create entry', error: err.message });
    }
};

// @GET /api/entries - Get all diary entries
exports.getEntries = async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ user_id: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ entries });
    } catch (err) {
        console.log('Failed to fetch entries:', err.message);
        res.status(500).json({ message: 'Failed to fetch entries', error: err.message });
    }
};

// @PUT /api/entries/:id - Update a diary entry
exports.updateEntry = async (req, res) => {
    let { id } = req.params;
    const { text_entry } = req.body;

    //console.log('id:', id); // prints id: :id=66f1f8527b17841bbd9b2499 - So, strip the :id= part (Tested in Postman)

    // Strip the :id= part
    id = id.split('=')[1];

    try {
        // Analyze new sentiment and generate a new response
        const sentiment = await googleNLPController.analyzeSentiment(text_entry);
        const auto_response = await gptResponseController.generateResponse({ text_entry, sentiment }); // TODO: send text_entry along with sentiment

        // Update the entry
        const entry = await DiaryEntry.findByIdAndUpdate(id, {
            text_entry: text_entry,
            auto_response: auto_response,
            sentiment_score: sentiment.score,
            sentiment_magnitude: sentiment.magnitude,
            updatedAt: Date.now(),
        }, { new: true });

        res.status(200).json({ entry });
    } catch (err) {
        console.log('Failed to update entry:', err.message);
        res.status(500).json({ message: 'Failed to update entry', error: err.message });
    }
};

// @DELETE /api/entries/:id - Delete a diary entry
exports.deleteEntry = async (req, res) => {
    let { id } = req.params;

    // Strip the :id= part
    id = id.split('=')[1];

    try {
        await DiaryEntry.findByIdAndDelete(id);
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (err) {
        console.log('Failed to delete entry:', err.message);
        res.status(500).json({ message: 'Failed to delete entry', error: err.message });
    }
};
