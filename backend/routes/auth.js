const express = require("express");
const bcrypt = require("bcryptjs");
const Customer = require("../models/customer");
const Seller = require("../models/seller");
const Product = require('../models/product');
const multer = require("multer");
const nodemailer = require("nodemailer"); 

// 🚨 CRITICAL: Define the router object
const router = express.Router(); 

// 2. Load environment variables 
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// --- Nodemailer Configuration and OTP Sending Function ---

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: EMAIL_USER, 
        pass: EMAIL_PASS 
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: 'Mobtick Support <no-reply@mobtick.com>', 
        to: email,
        subject: 'Mobtick - Your One-Time Password (OTP)',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Mobtick OTP Verification</h2>
                <p>Your verification OTP is:</p>
                <strong style="font-size: 24px; color: #007BFF;">${otp}</strong>
                <p>This code is valid for **10 minutes**.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error);
        throw new Error("Failed to send verification email."); 
    }
};

// --- OTP Helper Functions ---

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const OTP_EXPIRY_MINUTES = 10; 

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- Existing Routes ---
router.post("/manageproduct", async (req, res) => {
    try {
        // NOTE: Placeholder content removed for brevity, assuming your logic is here
        res.status(201).json({ success: true, msg: "Product management logic executed." });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error." });
    }
});

// --- UPDATED ROUTES FOR OTP AUTHENTICATION ---

// 1. Customer Signup (Stage 1: Send OTP) - Working
router.post("/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        let customer = await Customer.findOne({ email });

        if (customer && customer.isVerified) {
            return res.status(400).json({ success: false, msg: "Email already registered. Please log in." });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); 
        const hashedPassword = await bcrypt.hash(password, 10);

        if (customer && !customer.isVerified) {
            customer.fullname = fullname;
            customer.password = hashedPassword;
            customer.otp = otp;
            customer.otpExpires = otpExpires;
            await customer.save();
        } else {
            customer = new Customer({
                fullname, email, password: hashedPassword, otp, otpExpires, isVerified: false
            });
            await customer.save();
        }

        await sendOtpEmail(email, otp); 
        res.json({ success: true, msg: "OTP sent to your email. Please verify." });

    } catch (err) {
        if (err.message.includes("Failed to send verification email")) {
             return res.status(500).json({ success: false, msg: "Server error: Could not send verification email. Check server logs." });
        }
        if (err.code === 11000) {
            return res.status(400).json({ success: false, msg: "Email already registered." });
        }
        console.error("Signup error:", err);
        res.status(500).json({ success: false, msg: "Server error during signup." });
    }
});

// 2. NEW ROUTE: Verify OTP (Stage 2: Finalize Signup) - TROUBLESHOOTING LOGS ADDED
router.post("/verify-otp", async (req, res) => {
    console.log("--> VERIFY OTP: Request received."); // LOG A
    try {
        const { email, otp } = req.body;
        
        console.log(`--> VERIFY OTP: Looking up user ${email} with OTP ${otp}.`); // LOG B
        const customer = await Customer.findOne({ email }); // 🚨 Hanging often happens here or right after.

        // If the query hangs and throws an error, it will skip to the catch block
        
        console.log("--> VERIFY OTP: User lookup complete."); // LOG C

        if (!customer) {
            console.log("--> VERIFY OTP: User not found in DB.");
            return res.status(404).json({ success: false, msg: "User not found or email mismatch." });
        }

        if (customer.isVerified) {
            console.log("--> VERIFY OTP: User already verified.");
            return res.status(400).json({ success: false, msg: "Account already verified. Please login." });
        }
        
        console.log(`--> VERIFY OTP: Checking OTP and expiration. DB OTP: ${customer.otp}, Expiration: ${customer.otpExpires}`); // LOG D

        if (customer.otp !== otp || customer.otpExpires < new Date()) {
            
            console.log("--> VERIFY OTP: Validation failed. Clearing OTP."); // LOG E (Failure Path)
            
            customer.otp = undefined;
            customer.otpExpires = undefined;
            await customer.save();

            return res.status(400).json({ success: false, msg: "Invalid or expired OTP. Please try signup again." });
        }
        
        // Success Path
        console.log("--> VERIFY OTP: Validation successful. Saving verification state."); // LOG F (Success Path)
        customer.isVerified = true;
        customer.otp = undefined; 
        customer.otpExpires = undefined;
        await customer.save();

        res.json({ success: true, msg: "Email verified! Signup complete." }); 

    } catch (err) {
        console.error("--> VERIFY OTP: FATAL CATCH BLOCK EXECUTED:", err);
        res.status(500).json({ success: false, msg: "Server error during verification." });
    }
});

// 3. Customer Login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customer.findOne({ email }); // 1. Find the customer

        if (!customer) return res.json({ success: false, msg: "Invalid credentials" }); // 2. Check if customer exists

        // 🚨 CRITICAL CHECK 1: Ensure customer is verified
        if (!customer.isVerified) {
            return res.json({ success: false, msg: "Account not verified. Please complete OTP verification first." });
        }

        // 3. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) return res.json({ success: false, msg: "Invalid credentials" });

        // 4. Success
        res.json({ success: true, role: "customer" });
    } catch (err) {
        console.error("Customer Login server error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});
// --- Seller Login (Kept Same) ---
router.post("/seller/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const seller = await Seller.findOne({ email });

        if (!seller) return res.json({ success: false, msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.json({ success: false, msg: "Invalid credentials" });

        res.json({ success: true, role: "seller" });
    } catch (err) {
        console.error("Seller Login server error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});
module.exports = router;