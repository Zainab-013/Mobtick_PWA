import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Reviews from "./pages/Reviews"; // Adjust the path if needed
import MinimalPage from "./pages/MinimalPage";
import ThankYou from "./pages/Thankyou";

const stripePromise = loadStripe("pk_test_51SDlnFJq0C8bwqHFjsow8jWHN3PpeL3yJwAWN400jAyRFBnMRoaiwWzDQXOpeULjq054FeD7Dun5ywhnvBZWDTK800BYS2B6eV"); // ⚡️ Use your publishable key here

// Layout wrapper → shows Navbar only on homepage
const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname === "/home";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/buynow"
            element={
              <Elements stripe={stripePromise}>
                <BuyNow />
              </Elements>
            }
          />
          <Route path="/" element={<AnimatedLogo />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/unisex" element={<Unisex />} />
          <Route path="/mpage" element={<MinimalPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
