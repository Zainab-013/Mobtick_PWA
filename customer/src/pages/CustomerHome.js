// src/pages/CustomerHome.js
import React, { useEffect, useState } from "react";
import HeroSlider from "../Components/HeroSlider";
import TrendingWatches from "../Components/TrendingWatches";
import PublicReviews from "../Components/PublicReviews";
import Footer from "../Components/Footer";

const PRODUCTS_API = "https://mobtick-backend.onrender.com/api/products";
const REVIEWS_API = "https://mobtick-backend.onrender.com/api/reviews/top?limit=3";

const CustomerHome = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsErr, setReviewsErr] = useState("");

  useEffect(() => {
    // ✅ Fetch products
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
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

    // ✅ Fetch top-rated reviews
    const fetchTopReviews = async () => {
      try {
        const res = await fetch(REVIEWS_API);
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

  const sliderImages = deals.slice(0, 3).map((w) => w.imageUrl).filter(Boolean);

  return (
    <div>
      {/* Hero Slider */}
      {sliderImages.length > 0 ? <HeroSlider images={sliderImages} /> : <HeroSlider />}

      {/* Trending Watches Section */}
      <section className="py-10 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">Trending Watches</h2>

        {loading ? (
          <p className="text-center text-lg py-6">Loading...</p>
        ) : errMsg ? (
          <p className="text-center text-lg py-6 text-red-500">{errMsg}</p>
        ) : deals.length > 0 ? (
          <TrendingWatches deals={deals} />
        ) : (
          <p className="text-center text-lg py-6 text-gray-600">
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
  );
};

export default CustomerHome;
