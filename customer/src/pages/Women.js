import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Women = () => {
  const [filters, setFilters] = useState({
    brand: "",
    price: "",
    style: "",
    dialShape: "",
    dialColor: "",
    strapMaterial: "",
    strapColor: "",
    caseSize: "",
    caseMaterial: "",
    specialEdition: "",
    discountRange: "",
  });

  const [darkMode, setDarkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  // Dropdown options
  const priceOptions = [
    { label: "All", value: "" },
    { label: "Below 2000", value: "low" },
    { label: "2000 - 10000", value: "mid" },
    { label: "Above 10000", value: "high" },
  ];
  const styleOptions = ["All", "Analog", "Digital", "Analog-Digital"];
  const dialShapeOptions = ["All", "Round", "Square", "Rectangular"];
  const dialColorOptions = ["All", "Black", "White", "Blue", "Red", "Brown", "Green", "Silver", "Gold"];
  const strapMaterialOptions = ["All", "Leather", "Metal", "Resin", "Nylon"];
  const strapColorOptions = ["All", "Black", "Brown", "Gold", "Silver", "Blue", "Red"];
  const caseSizeOptions = ["All", "38mm", "40mm", "42mm", "44mm"];
  const caseMaterialOptions = ["All", "Stainless Steel", "Titanium", "Gold-Plated", "Ceramic", "Plastic/Resin"];
  const specialEditionOptions = ["All", "Limited Edition", "Signature Series", "Vintage Collection"];
  const discountRangeOptions = ["All", "10-20%", "20-30%", "30-40%", "40%+"];

  // Animate header & main
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Build API query params including discountRange
  const buildParams = useCallback(() => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (!value || value === "All") return;

      if (key === "price") {
        switch (value) {
          case "low":
            params.minPrice = 0;
            params.maxPrice = 2000;
            break;
          case "mid":
            params.minPrice = 2000;
            params.maxPrice = 10000;
            break;
          case "high":
            params.minPrice = 10000;
            break;
          default:
            break; // ✅ added default
        }
      } else if (key === "discountRange") {
        switch (value) {
          case "10-20%":
            params.minDiscount = 10;
            params.maxDiscount = 20;
            break;
          case "20-30%":
            params.minDiscount = 20;
            params.maxDiscount = 30;
            break;
          case "30-40%":
            params.minDiscount = 30;
            params.maxDiscount = 40;
            break;
          case "40%+":
            params.minDiscount = 40;
            break;
          default:
            break; // ✅ added default
        }
      } else {
        params[key] = value;
      }
    });
    return params;
  }, [filters]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/products/women`, { params: buildParams() });
      const data = res.data?.products || [];

      const normalized = data.map((p) => ({
        id: p._id,
        name: p.brandName || "Unnamed Watch",
        brand: p.brandName || "",
        priceNumber: Number(p.price) || 0,
        price: p.price ? `₹${p.price}` : "₹0",
        image: p.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
        description: p.description || "",
        style: p.typeOfWatch || "",
        dialShape: p.dialShape || "",
        dialColor: p.dialColor || "",
        strapMaterial: p.strapMaterial || "",
        strapColor: p.strapColor || "",
        caseSize: p.caseSize || "",
        caseMaterial: p.caseMaterial || "",
        specialEdition: p.specialEdition || "",
        discount: p.discount || 0,
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Fetch women products error:", err);
      setError("Failed to load products. Try again.");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetFilters = () => {
    setFilters({
      brand: "",
      price: "",
      style: "",
      dialShape: "",
      dialColor: "",
      strapMaterial: "",
      strapColor: "",
      caseSize: "",
      caseMaterial: "",
      specialEdition: "",
      discountRange: "",
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative min-h-screen bg-gray-100 dark:bg-black/90 text-gray-900 dark:text-white font-sans transition-all duration-500">
        {/* Navbar */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white 
                      px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
                        animateHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
                      }`}
        >
          <div className="flex items-center space-x-3">
            <img src={mobticklogo} alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">MOBTICK</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={() => navigate("/watches")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Main content */}
        <main
          className={`flex transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Sidebar Filters */}
          <aside className="w-64 p-6 overflow-y-auto max-h-screen bg-white dark:bg-black/30 border-r border-gray-300 dark:border-white backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            <button
              onClick={resetFilters}
              className="w-full mb-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>

            {[
              { label: "Brand", key: "brand", options: [] },
              { label: "Price", key: "price", options: priceOptions },
              { label: "Style", key: "style", options: styleOptions },
              { label: "Dial Shape", key: "dialShape", options: dialShapeOptions },
              { label: "Dial Color", key: "dialColor", options: dialColorOptions },
              { label: "Strap Material", key: "strapMaterial", options: strapMaterialOptions },
              { label: "Strap Color", key: "strapColor", options: strapColorOptions },
              { label: "Case Size", key: "caseSize", options: caseSizeOptions },
              { label: "Case Material", key: "caseMaterial", options: caseMaterialOptions },
              { label: "Special Edition", key: "specialEdition", options: specialEditionOptions },
              { label: "Discount Range", key: "discountRange", options: discountRangeOptions },
            ].map((filter) => (
              <div className="mb-4" key={filter.key}>
                <label className="block mb-1 font-semibold">{filter.label}</label>
                {filter.options.length > 0 ? (
                  <select
                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-black dark:text-white"
                    value={filters[filter.key]}
                    onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={`Enter ${filter.label}`}
                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-black dark:text-white"
                    value={filters[filter.key]}
                    onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </aside>

          {/* Product Grid */}
          <section className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Women’s Watches</h1>
            {loading ? (
              <p className="text-center py-10">Loading products…</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-gray-400 text-center">No products found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-2xl shadow-lg overflow-hidden border border-gray-300 dark:border-white bg-white dark:bg-gray-900 text-black dark:text-white hover:shadow-xl transition duration-300 cursor-pointer"
                  >
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-green-600 dark:text-green-400 font-semibold">{product.price}</p>
                        {product.discount > 0 && (
                          <span className="text-red-500 font-bold text-sm">{product.discount}% OFF</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-2xl font-bold text-gray-600 dark:text-gray-300"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
              <p className="text-green-600 dark:text-green-400 font-semibold">{selectedProduct.price}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{selectedProduct.description}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() =>
                    navigate("/buynow", {
                      state: { product: { ...selectedProduct, price: selectedProduct.priceNumber, name: selectedProduct.name } },
                    })
                  }
                  className="flex-1 px-6 text-white bg-black dark:bg-gray-800 border dark:border-gray-600 dark:text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition"
                >
                  Buy Now
                </button>

                <button
                  onClick={() =>
                    navigate("/cart", {
                      state: { newItem: { ...selectedProduct, price: selectedProduct.priceNumber, name: selectedProduct.name } },
                    })
                  }
                  className="flex-1 px-6 text-white bg-gray-600 dark:bg-gray-700 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Women;
