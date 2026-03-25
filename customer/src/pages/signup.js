import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Define the base path for authentication endpoints
const AUTH_BASE_URL = "https://mobtick-backend.onrender.com/api/auth";

const Signup = () => {
    // --- State Management ---
    const [showShimmer, setShowShimmer] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false); 
    const [isResending, setIsResending] = useState(false); 

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    // --- Effects & Toggles ---
    useEffect(() => {
        const timer = setTimeout(() => setShowShimmer(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const goBackToSignup = () => {
        setOtpSent(false);
        setOtp("");
        setError("");
        setSuccess("Please review your details or try sending the OTP again.");
    };

    // --- Core Signup/Verification Logic (Enhanced for Debugging) ---
    const handleSignup = async (e) => {
        e.preventDefault();
        
        // --- STEP 1: LOG START ---
        console.log("1. Starting request. OTP Sent State:", otpSent);

        setError("");
        setSuccess("");
        setIsResending(false);

        const url = otpSent 
            ? `${AUTH_BASE_URL}/verify-otp` 
            : `${AUTH_BASE_URL}/signup`; 
        
        const bodyData = otpSent 
            ? JSON.stringify({ email, otp }) 
            : JSON.stringify({ fullname, email, password });
        
        if (!otpSent) {
            setSuccess("Sending OTP...");
        }

        try {
            // --- STEP 2: LOG REQUEST ---
            console.log("2. Sending request to:", url);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: bodyData, 
            });

            // --- STEP 3: LOG RESPONSE STATUS ---
            console.log("3. Received response status:", res.status);
            
            // 🚨 CRITICAL FIX: Handle non-2xx status codes before trying to parse JSON.
            if (!res.ok) {
                console.error("4. Server returned non-OK status. Status:", res.status);
                
                // Attempt to read JSON error body for meaningful message
                const errorData = await res.json().catch(() => ({ 
                    msg: `Request failed with status ${res.status}. Check Network tab.` 
                }));
                
                // Set error state and return early
                setError(errorData.msg || `Request failed with status ${res.status}`);
                setSuccess("");
                return; 
            }

            // If status is 200, try to parse JSON
            const data = await res.json();

            // --- STEP 4: LOG SUCCESS DATA ---
            console.log("5. Parsed data:", data);


            if (data.success) {
                if (!otpSent) {
                    // Stage 1 Success: OTP sent
                    setOtpSent(true); 
                    setSuccess("OTP sent to your email! Please check and enter it below.");
                    setError(""); 
                } else {
                    // Stage 2 Success: User created and verified
                    setSuccess("Signup successful and verified! Redirecting to login...");
                    setTimeout(() => {
                        navigate("/login"); 
                    }, 2000);
                }
            } else {
                // --- STEP 5: LOG SERVER-RETURNED ERROR ---
                console.error("6. Server returned failure (success: false). Message:", data.msg);
                setError(data.msg);
                setSuccess("");
            }
        } catch (err) {
            // --- STEP 6: LOG CATCH BLOCK ERROR ---
            console.error("7. CATCH BLOCK EXECUTED: Network or JSON parsing failure.", err);
            setError("⚠️ Server error, try again later. (Check console for network failure)");
            setSuccess("");
        }
    };

    // --- Resend OTP Logic ---
    const handleResendOtp = async () => {
        setIsResending(true);
        setError("");
        setSuccess("Resending OTP...");
        
        try {
            const res = await fetch(`${AUTH_BASE_URL}/signup`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("New OTP sent successfully! Check your inbox.");
                setError("");
            } else {
                setError(data.msg || "Failed to resend OTP.");
                setSuccess("");
            }
        } catch (err) {
            setError("⚠️ Server error during resend, try again later.");
        } finally {
            setIsResending(false);
        }
    };


    // --- Render ---
    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'} px-4`}>
            {showShimmer && <div className="shimmer absolute inset-0 z-0" />}
            <div className={`w-full max-w-sm rounded-xl shadow-xl z-10 p-6 transition-all duration-700 animate-fade-in ${darkMode ? 'bg-gray-800' : 'bg-black'}`}>
                
                <div className="flex justify-end mb-2">
                    <button onClick={toggleDarkMode} className="text-xs text-gray-300 hover:underline">
                        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Signup for Mobtick</h2>

                {/* Display Messages */}
                {error && <p className="text-red-400 text-center mb-3">{error}</p>}
                {success && <p className="text-green-400 text-center mb-3">{success}</p>}
                
                <form className="space-y-6" onSubmit={handleSignup}>
                    
                    {!otpSent ? (
                        <>
                            {/* Input Fields (Stage 1) */}
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="w-full p-3 border rounded-md bg-gray-100 text-sm"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-md bg-gray-100 text-sm"
                                required
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-md bg-gray-100 text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </>
                    ) : (
                        // OTP Input Field (Stage 2)
                        <div className="space-y-3">
                             <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-3 border rounded-md bg-gray-100 text-sm text-center tracking-widest"
                                maxLength="6"
                                required
                            />
                            {/* UX Buttons for OTP stage */}
                            <div className="flex justify-between text-xs text-gray-300">
                                <button 
                                    type="button" 
                                    onClick={goBackToSignup} 
                                    className="hover:underline"
                                >
                                    ← Change Details
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleResendOtp} 
                                    disabled={isResending}
                                    className={`hover:underline ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isResending} 
                            className={`w-full px-14 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition text-sm ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {otpSent ? 'Verify OTP & Complete Signup' : 'Send OTP & Signup'}
                        </button>
                    </div>
                </form>

                <button onClick={() => navigate("/")} className="mt-3 text-white underline w-full">
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};

export default Signup;