// Imports
const mongoose = require('mongoose');

// Create a new schema
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    activationToken: { type: String, default: null },
    activationTokenExpiry: { type: Date, default: null },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    }, {
        timestamps: true
    });

// Create a new model and export it
module.exports = mongoose.model('User', userSchema, 'users');