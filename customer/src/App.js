import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CustomerHome from "./pages/CustomerHome";
import Watches from "./pages/Watches";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Cart from "./pages/Cart";
import Chatbot from "./pages/Chatbot";
import AnimatedLogo from "./pages/AnimatedLogo";
import Navbar from "./Components/Navbar";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import BuyNow from "./pages/BuyNow";
import Reviews from "./pages/Reviews";
import MinimalPage from "./pages/MinimalPage";
import ThankYou from "./pages/Thankyou";

const stripeKey = process.env.REACT_APP_STRIPE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Protected route wrapper → redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper → shows Navbar on main pages (not login/signup/splash)
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = [
    "/", "/login", "/signup", "/buynow", "/thankyou", "/mpage",
    "/watches", "/cart", "/chatbot", "/reviews", "/men", "/women", "/unisex",
  ];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
    <a href="/home" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
      Go Home
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes — anyone can browse */}
          <Route path="/" element={<AnimatedLogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mpage" element={<MinimalPage />} />
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/unisex" element={<Unisex />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected routes — login required for buying/paying */}
          <Route
            path="/buynow"
            element={
              <ProtectedRoute>
                <Elements stripe={stripePromise}>
                  <BuyNow />
                </Elements>
              </ProtectedRoute>
            }
          />
          <Route path="/thankyou" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
