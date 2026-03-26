// src/pages/Cart.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { BsCart3 } from "react-icons/bs";
import mobticklogo from "../assets/mobticklogo.png";
import { useDarkMode } from "../DarkModeContext";

const Cart = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("authToken"));

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("authToken"));
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  // ✅ Load cart from localStorage initially
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      localStorage.removeItem("cartItems");
      return [];
    }
  });

  // ✅ Handle new product from navigation
  useEffect(() => {
    const newItem = location.state?.newItem;
    if (newItem) {
      setCartItems((prev) => {
        const exists = prev.find((item) => item.id === newItem.id);
        let updated;
        if (exists) {
          updated = prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updated = [...prev, { ...newItem, quantity: 1 }];
        }
        return updated;
      });
    }
  }, [location.state]);

  // ✅ Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems((items) => {
      const updated = items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/buynow", { state: { cartItems } });
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-black/90 text-gray-900 dark:text-white font-sans transition-all duration-500">
        {/* Shimmer background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-700/10 animate-[shimmer_8s_linear_infinite]"></div>
        </div>

        {/* Navbar */}
        <header
          className={`relative z-10 flex items-center justify-between border-b border-black dark:border-white 
                      px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
                        animateHeader
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-10"
                      }`}
        >
          <div className="flex items-center space-x-3">
            <img src={mobticklogo} alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">MOBTICK</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("userName");
                  localStorage.removeItem("userEmail");
                  window.dispatchEvent(new Event("authChange"));
                  navigate("/login");
                }}
                className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
              >
                LOGIN
              </button>
            )}
          </div>
        </header>

        {/* Heading */}
        <h2
          className={`relative z-10 text-3xl font-bold text-center mt-8 mb-6 flex items-center justify-center gap-3 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <BsCart3 className="text-4xl" />
          Your Cart
        </h2>

        {/* Main Section */}
        <main
          className={`relative z-10 max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Cart Items */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border dark:border-white">
            <h3 className="text-xl font-semibold mb-4">Shopping Items</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 dark:border-gray-700 py-4 gap-3">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" />
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      <p className="font-medium mt-1 text-sm sm:text-base">
                        ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                    <div className="flex items-center border rounded-lg dark:border-gray-600">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg">
                        <Minus size={16} />
                      </button>
                      <span className="px-3 sm:px-4 text-sm sm:text-base">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-fit border dark:border-white">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex flex-col gap-2 mb-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                  <span>{item.name} ({item.quantity} pcs)</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold mt-4 border-t pt-4 border-gray-300 dark:border-gray-700">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button onClick={handlePayNow} className="mt-6 w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition">
              Pay Now
            </button>
          </div>
        </main>
    </div>
  );
};

export default Cart;
