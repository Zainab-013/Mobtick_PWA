import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png"; // adjust path if needed

const AnimatedLogo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // Redirect after 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-black via-gray-800 to-gray-900">
      <img
        src={mobticklogo}
        alt="Mobtick Logo"
        className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[30%] animate-pulse drop-shadow-lg"
      />
    </div>
  );
};

export default AnimatedLogo;
