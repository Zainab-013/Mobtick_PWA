import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Login = () => {
    const [showShimmer, setShowShimmer] = useState(true);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setShowShimmer(false), 1800);
        return () => clearTimeout(timer);
    }, []);


    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log("Login response:", data);
            if (data.success) {
                // Store auth token and user info
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    console.log("Token saved:", localStorage.getItem("authToken") ? "YES" : "NO");
                }
                if (data.user) {
                    localStorage.setItem("userName", data.user.name);
                    localStorage.setItem("userEmail", data.user.email);
                    console.log("User saved:", localStorage.getItem("userName"));
                }
                // Notify Navbar about auth change
                window.dispatchEvent(new Event("authChange"));
                // Small delay to ensure state propagates before navigation
                setTimeout(() => navigate("/home"), 100);
            } else {
                setError(data.msg);
            }
        } catch (err) {
            console.error("Login fetch error:", err);
            setError("⚠️ Server error, try again later.");
        } finally {
            setLoading(false);
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
                            disabled={loading}
                            className={`w-full px-14 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <button onClick={() => navigate("/signup")} className="mt-3 text-white underline w-full">
                    Signup
                </button>
            </div>
        </div>
    );
};

export default Login;