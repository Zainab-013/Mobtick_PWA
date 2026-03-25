const express = require("express");
const bcrypt = require("bcryptjs");
const Customer = require("../models/customer");
const Seller = require("../models/seller");
const Product = require('../models/product');
const multer = require("multer");
const nodemailer = require("nodemailer"); 
const { generateToken } = require("../middleware/auth");

const router = express.Router(); 

// Load environment variables 
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// --- Nodemailer Configuration ---
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
                <p>This code is valid for <b>10 minutes</b>.</p>
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

// --- Routes ---

// Manage product (placeholder)
router.post("/manageproduct", async (req, res) => {
    try {
        res.status(201).json({ success: true, msg: "Product management logic executed." });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error." });
    }
});

// 1. Customer Signup (Stage 1: Send OTP)
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
        const hashedOtp = await bcrypt.hash(otp, 10);

        if (customer && !customer.isVerified) {
            customer.fullname = fullname;
            customer.password = hashedPassword;
            customer.otp = hashedOtp;
            customer.otpExpires = otpExpires;
            await customer.save();
        } else {
            customer = new Customer({
                fullname, email, password: hashedPassword, otp: hashedOtp, otpExpires, isVerified: false
            });
            await customer.save();
        }

        await sendOtpEmail(email, otp); 
        res.json({ success: true, msg: "OTP sent to your email. Please verify." });

    } catch (err) {
        if (err.message.includes("Failed to send verification email")) {
             return res.status(500).json({ success: false, msg: "Server error: Could not send verification email." });
        }
        if (err.code === 11000) {
            return res.status(400).json({ success: false, msg: "Email already registered." });
        }
        console.error("Signup error:", err);
        res.status(500).json({ success: false, msg: "Server error during signup." });
    }
});

// 2. Verify OTP (Stage 2: Finalize Signup)
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ success: false, msg: "User not found or email mismatch." });
        }

        if (customer.isVerified) {
            return res.status(400).json({ success: false, msg: "Account already verified. Please login." });
        }

        const isOtpExpired = customer.otpExpires < new Date();
        const isOtpValid = customer.otp ? await bcrypt.compare(otp, customer.otp) : false;

        if (!isOtpValid || isOtpExpired) {
            customer.otp = undefined;
            customer.otpExpires = undefined;
            await customer.save();
            return res.status(400).json({ success: false, msg: "Invalid or expired OTP. Please try signup again." });
        }
        
        // Success
        customer.isVerified = true;
        customer.otp = undefined; 
        customer.otpExpires = undefined;
        await customer.save();

        res.json({ success: true, msg: "Email verified! Signup complete." }); 

    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ success: false, msg: "Server error during verification." });
    }
});

// 3. Customer Login — returns JWT token
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        if (!customer.isVerified) {
            return res.status(403).json({ success: false, msg: "Account not verified. Please complete OTP verification first." });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        // Generate JWT
        const token = generateToken({ id: customer._id, email: customer.email, role: "customer" });
        res.json({ success: true, role: "customer", token, user: { name: customer.fullname, email: customer.email } });
    } catch (err) {
        console.error("Customer Login server error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

// 4. Seller Login — returns JWT token
router.post("/seller/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        const token = generateToken({ id: seller._id, email: seller.email, role: "seller" });
        res.json({ success: true, role: "seller", token });
    } catch (err) {
        console.error("Seller Login server error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

module.exports = router;