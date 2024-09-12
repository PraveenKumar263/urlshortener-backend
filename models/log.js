// Imports
const mongoose = require("mongoose");

// Create a new schema
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shortenerCode: { type: String, required: true },
  clickedAt: { type: Date, default: Date.now },
});

// Create a new model and export it
module.exports = mongoose.model("Log", logSchema, "logs");
