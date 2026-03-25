import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

// 🚨 FIX: Define the base path for all authentication endpoints
const AUTH_BASE_URL = "https://mobtick-backend.onrender.com/api/auth";

const Login = () => {
    const [showShimmer, setShowShimmer] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => setShowShimmer(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // Decide if seller or customer based on URL
        const isSeller = location.pathname.includes("seller");
        const endpoint = isSeller ? "/seller/login" : "/login";

        // 🚨 FIX APPLIED HERE: Use AUTH_BASE_URL prefix for the fetch call
        try {
            const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.success) {
                if (data.role === "seller") {
                    navigate("/dashboard");
                } else {
                    navigate("/home"); // Changed to /home, as /dashboard is usually for sellers
                }
            } else {
                setError(data.msg);
            }
        } catch (err) {
            console.error("Login fetch error:", err);
            setError("⚠️ Server error, try again later.");
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'} px-4`}>
            {showShimmer && <div className="shimmer absolute inset-0 z-0" />}
            <div className={`w-full max-w-sm rounded-xl shadow-xl z-10 p-6 transition-all duration-700 animate-fade-in ${darkMode ? 'bg-gray-800' : 'bg-black'}`}>
                
                <div className="flex justify-end mb-2">
                    <button onClick={toggleDarkMode} className="text-xs text-gray-300 hover:underline">
                        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-center text-white">Login to Mobtick</h2>

                {error && <p className="text-red-400 text-center mb-3">{error}</p>}

                <form className="space-y-6" onSubmit={handleLogin}>
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

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full px-14 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition text-sm"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Only show signup button if it's NOT seller login */}
                {!location.pathname.includes("seller") && (
<button onClick={() => navigate("/signup")} className="mt-3 text-white underline w-full">
    Signup
</button>
                )}
            </div>
        </div>
    );
};

export default Login;