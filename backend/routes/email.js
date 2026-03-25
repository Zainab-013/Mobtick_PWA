const nodemailer = require("nodemailer");

// Load environment variables (assuming you installed dotenv and configured it)
// Note: If you load dotenv in app.js/server.js, you don't need it here.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

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
            <div style="/* ... HTML styles ... */">
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
        // Throw a specific error to allow the router to catch it gracefully
        throw new Error("Failed to send verification email."); 
    }
};

module.exports = {
    sendOtpEmail
};