// src/pages/BuyNow.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDarkMode } from "../DarkModeContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const CheckoutStripeForm = ({ amount, onSuccess, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!data.clientSecret) {
        alert("Payment initialization error.");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setLoading(false);
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Payment failed.");
    }
  };

  return (
    <form onSubmit={handleStripePayment} className="mt-3 space-y-4">
      <CardElement options={{ hidePostalCode: true }} />
      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm py-2 transition"
      >
        {loading ? "Processing..." : `Pay ₹${amount} Now`}
      </button>
    </form>
  );
};

const BuyNow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const singleProduct = location.state?.product;
  const cartItems = location.state?.cartItems;
  const isCartCheckout = cartItems && cartItems.length > 0;

  // Safe fallback if no product is passed
  const defaultProduct = singleProduct || {
    name: "Sample Watch",
    price: 4999,
    image: "/images/sample.jpg",
    quantity: 1,
  };

  const initialQuantity = isCartCheckout ? 1 : defaultProduct.quantity || 1;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    brand: defaultProduct.name,
    watchType: defaultProduct.name,
    quantity: initialQuantity,
    price: defaultProduct.price,
    orderDate: "",
    priceMode: "",
    totalAmount: defaultProduct.price * initialQuantity,
  });

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);

  useEffect(() => {
    if (!isCartCheckout) {
      setFormData((prev) => ({ ...prev, totalAmount: prev.quantity * prev.price }));
    } else {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setFormData((prev) => ({ ...prev, totalAmount: total }));
    }
    // eslint-disable-next-line
  }, [formData.quantity, formData.price, cartItems, isCartCheckout]);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!pincodeRegex.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return false;
    }
    return true;
  };

  const allDetailsFilled =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.pincode &&
    formData.priceMode;

  // Save order to backend
  const completeOrder = async (paymentIntentId = null) => {
    if (!allDetailsFilled) {
      alert("Please fill all required fields!");
      return;
    }
    if (!validateForm()) return;

    const orderPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      items: isCartCheckout
        ? cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          }))
        : [
            {
              id: singleProduct?.id || "sample-id",
              name: defaultProduct.name,
              image: defaultProduct.image,
              price: defaultProduct.price,
              quantity: formData.quantity,
            },
          ],
      brand: defaultProduct.name,
      watchType: defaultProduct.name,
      quantity: formData.quantity,
      pricePerItem: defaultProduct.price,
      totalAmount: formData.totalAmount,
      paymentMode: formData.priceMode,
      paymentIntentId: paymentIntentId || null,
      paymentStatus: formData.priceMode === "cod" ? "pending" : "succeeded",
      orderDate: formData.orderDate || new Date(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.ok) {
        // Clear purchased items from localStorage
        if (isCartCheckout) {
          const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
          const remainingCart = savedCart.filter(
            (item) => !cartItems.some((purchased) => purchased.id === item.id)
          );
          localStorage.setItem("cartItems", JSON.stringify(remainingCart));
        } else {
          const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
          const remainingCart = savedCart.filter((item) => item.id !== singleProduct?.id);
          localStorage.setItem("cartItems", JSON.stringify(remainingCart));
        }

        // Navigate to thank you page with real order details
        navigate("/thankyou", {
          state: {
            orderDetails: {
              product: defaultProduct.name,
              amount: formData.totalAmount,
              date: new Date().toLocaleString(),
              orderId: data.orderId || "ORDER" + Date.now(),
            },
          },
        });
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      console.error("Order API error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCOD = () => {
    if (!allDetailsFilled) {
      alert("Please fill all required fields!");
      return;
    }
    if (!validateForm()) return;
    completeOrder();
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              address: data.address.road || "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              state: data.address.state || "",
              pincode: data.address.postcode || "",
            }));
          } catch (err) {
            alert("Unable to fetch location. Try manually.");
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied. Please enter your address manually.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location unavailable. Please enter your address manually.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again or enter manually.");
              break;
            default:
              alert("Unable to get location. Please enter your address manually.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black/90 font-sans transition-all duration-500 flex flex-col text-gray-900 dark:text-white">
        {/* Navbar */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white 
                      px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
                        animateHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
                      }`}
        >
          <div className="flex items-center space-x-3">
            <img src={mobticklogo} alt="MOBTICK Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">
              MOBTICK
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-sm sm:text-lg font-bold bg-gray-500 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-600 transition text-white"
            >
              BACK
            </button>
            <button
              onClick={() => navigate("/home")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition text-white"
            >
              HOME
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`flex-1 flex w-full max-w-7xl mx-auto flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)] p-4 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left: Product Info */}
          {!isCartCheckout && singleProduct && (
            <div className="lg:w-1/2 flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 flex flex-col justify-center items-center border-2 border-transparent dark:border-white">
              <div className="flex flex-col justify-center items-center text-center -mt-8">
                <img
                  src={singleProduct.image || defaultProduct.image}
                  alt={singleProduct.name || defaultProduct.name}
                  className="w-full max-h-64 md:w-80 md:h-80 object-contain rounded-2xl shadow-md -mt-6"
                />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {singleProduct.name || defaultProduct.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 mt-2 text-xl md:text-2xl">
                  ₹{singleProduct.price || defaultProduct.price}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-base md:text-lg max-w-xs md:max-w-md">
                  {singleProduct.description || "High-quality watch with modern design."}
                </p>
                <div className="mt-5 flex justify-center items-center gap-4">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))
                    }
                    className="px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-lg md:text-xl"
                  >
                    -
                  </button>
                  <span className="text-lg md:text-2xl font-semibold">{formData.quantity}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
                    }
                    className="px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-lg md:text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right: Form + Order Summary */}
          <div className="lg:w-1/2 flex-1 flex flex-col gap-4">
            {/* Form */}
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 border border-gray-200 dark:border-white overflow-auto">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                Billing & Payment
              </h3>

              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition mb-3 w-full" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition mb-3 w-full" />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition mb-3 w-full" />

              {/* Address + Use Location */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="flex-1 p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition" />
                <button type="button" onClick={handleUseLocation} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm transition whitespace-nowrap">
                  📍 Use My Location
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <input type="text" name="city" placeholder="City" value={formData.city || ""} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition" />
                <input type="text" name="state" placeholder="State" value={formData.state || ""} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition" />
                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode || ""} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition" />
              </div>

              <input type="date" name="orderDate" placeholder="Order Date" value={formData.orderDate} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition mb-3 w-full" />

              <select name="priceMode" value={formData.priceMode} onChange={handleChange} className="p-3 rounded border dark:border-white bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 text-sm transition w-full">
                <option value="">Select Payment Mode</option>
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 border border-gray-200 dark:border-white">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">Order Summary</h3>

              {isCartCheckout ? (
                <div className="flex flex-col gap-2 mt-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-gray-700 dark:text-gray-200 text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : singleProduct ? (
                <div className="flex justify-between items-center text-gray-700 dark:text-gray-200 text-sm mt-2">
                  <div className="flex items-center gap-2">
                    <img src={singleProduct.image} alt={singleProduct.name} className="w-12 h-12 object-cover rounded-lg" />
                    <span>{defaultProduct.name} × {formData.quantity}</span>
                  </div>
                  <span>₹{formData.totalAmount}</span>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-sm">No product selected.</p>
              )}

              <div className="border-t pt-2 flex justify-between font-bold text-gray-900 dark:text-white text-sm">
                <span>Total</span>
                <span>₹{formData.totalAmount}</span>
              </div>

              {/* Payment Section */}
              {formData.priceMode === "online" ? (
                <CheckoutStripeForm
                  amount={formData.totalAmount}
                  onSuccess={completeOrder}
                  disabled={!allDetailsFilled}
                />
              ) : (
                <button
                  onClick={handleCOD}
                  className="mt-3 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-semibold text-sm transition transform hover:scale-105 w-full"
                >
                  Pay Now (COD)
                </button>
              )}
            </div>
          </div>
        </main>
    </div>
  );
};

export default BuyNow;
