const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    fullname: { 
        type: String,
        required: true 
    },
    email: { 
        type: String, 
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: { // This will store the bcrypt hash
        type: String,
        required: true
    },
    
    // --- New Fields for OTP Authentication ---
    otp: {
        type: String,
        required: false // Optional, as it's only present when pending verification
    },
    otpExpires: {
        type: Date,
        required: false // Optional, cleared after verification/expiration
    },
    isVerified: {
        type: Boolean,
        default: false // Crucial flag: default to unverified
    }
    // ------------------------------------------
}, {
    timestamps: true // Optional, but good practice for tracking creation/updates
});

module.exports = mongoose.model("Customer", customerSchema);