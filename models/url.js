// Imports
const mongoose = require('mongoose');

// Create a new schema
const URLSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortenerCode: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

// Create a new model and export it
module.exports = mongoose.model('URL', URLSchema);
