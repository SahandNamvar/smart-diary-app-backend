// Diary Entry Model (Mongoose Schema)

const mongoose = require('mongoose');

// Define the Diary Entry Schema
const DiaryEntrySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text_entry: {
        type: String,
        required: true,
    },
    auto_response: {
        type: String,
    },
    sentiment_score: {
        type: Number,
    },
    sentiment_magnitude: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
}); 

// Update the timestamp on document update
DiaryEntrySchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

// Create the Diary Entry model
const DiaryEntry = mongoose.model('DiaryEntry', DiaryEntrySchema);

module.exports = DiaryEntry;