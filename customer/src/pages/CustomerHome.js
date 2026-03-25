// src/pages/CustomerHome.js
import React, { useEffect, useState } from "react";
import HeroSlider from "../Components/HeroSlider";
import TrendingWatches from "../Components/TrendingWatches";
import PublicReviews from "../Components/PublicReviews";
import Footer from "../Components/Footer";
import { useDarkMode } from "../DarkModeContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const CustomerHome = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsErr, setReviewsErr] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const data = await res.json();
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        if (products.length === 0) setErrMsg(data.msg || "No products returned.");
        setDeals(products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setErrMsg(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTopReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews/top?limit=3`);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).slice(0, 3).map((r) => ({
          user: r.name,
          comment: r.comment,
          rating: r.rating,
        }));
        setReviews(mapped);
      } catch (err) {
        console.error("Error fetching top reviews:", err);
        setReviewsErr(err.message || "Failed to fetch reviews.");
      }
    };

    fetchProducts();
    fetchTopReviews();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black/90 text-gray-900 dark:text-white transition-all duration-500">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-20 right-4 z-50 text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1.5 rounded-full shadow-lg hover:opacity-80 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Hero Slider */}
        <HeroSlider />

        {/* Trending Watches Section */}
        <section className="py-10 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900 dark:text-white">Trending Watches</h2>

          {loading ? (
            <p className="text-center text-lg py-6 dark:text-gray-300">Loading...</p>
          ) : errMsg ? (
            <p className="text-center text-lg py-6 text-red-500">{errMsg}</p>
          ) : deals.length > 0 ? (
            <TrendingWatches deals={deals} />
          ) : (
            <p className="text-center text-lg py-6 text-gray-600 dark:text-gray-400">
              No trending watches available.
            </p>
          )}
        </section>

        {/* Public Reviews Section */}
        {reviewsErr ? (
          <p className="text-center text-lg py-6 text-red-500">{reviewsErr}</p>
        ) : (
          <PublicReviews reviews={reviews} />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default CustomerHome;
