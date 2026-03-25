// src/pages/ReviewPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import mobticklogo from "../assets/mobticklogo.png";


const Reviews = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  // Animations
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // ✅ Fetch reviews from backend (with console logs for debugging)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
       console.log("Calling API:", "https://mobtick-backend.onrender.com/api/reviews");
const res = await fetch("https://mobtick-backend.onrender.com/api/reviews");

        console.log("Response status:", res.status);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // ✅ Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rating || !form.comment) {
      alert("Please fill in all fields");
      return;
    }

    try {
     const res = await fetch(
  "https://mobtick-backend.onrender.com/api/reviews",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  }
);


      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", rating: 0, comment: "" });
        setReviews((prev) => [data.review, ...prev]); // update UI instantly
        alert("✅ Review submitted!");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative min-h-screen bg-gray-100 dark:bg-black/90 text-gray-900 dark:text-white font-sans transition-all duration-500">
        
        {/* 🔹 Shimmer Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 animate-shimmer" />
        </div>

        {/* 🔹 Navbar */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
            animateHeader
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="flex items-center space-x-3">
            <img
              src={mobticklogo}
              alt="MOBTICK Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">
              MOBTICK
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => navigate("/home")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* 🔹 Main Section */}
        <main
          className={`container mx-auto px-6 py-10 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Customer Reviews</h2>

          {/* Review Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 border border-gray-400 dark:border-white shadow-lg rounded-xl p-6 mb-10 max-w-lg mx-auto"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-black dark:text-white focus:outline-none"
            />

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`cursor-pointer text-2xl transition ${
                    star <= form.rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
              ))}
            </div>

            <textarea
              placeholder="Your Review"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows="4"
              className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-black dark:text-white focus:outline-none"
            />

            <button
              type="submit"
              className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Submit Review
            </button>
          </form>

          {/* 🔹 Reviews List */}
      {/* 🔹 Reviews List */}
<div className="max-w-6xl mx-auto">
  {/* New heading */}
  <h2 className="text-2xl font-bold mb-6 text-center">All Reviews</h2>

  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {reviews.length > 0 ? (
      reviews.map((rev) => (
        <div
          key={rev._id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{rev.name}</h3>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg ${
                    i < rev.rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm">{rev.comment}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(rev.createdAt).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No reviews yet.</p>
    )}
  </div>
</div>

        </main>
      </div>
    </div>
  );
};

export default Reviews;
