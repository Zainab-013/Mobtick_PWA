// src/Components/Navbar.js
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaStar, FaUserAlt, FaBoxOpen } from "react-icons/fa"; 
 // Home & Reviews
import { MdWatch } from "react-icons/md"; // Watch icon
import { IoMdChatbubbles } from "react-icons/io"; // Sleek chatbot icon
import { Link as RouterLink } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

const navItems = [
  { name: "Home", to: "/home", icon: <FaHome className="text-blue-400 text-2xl mb-1" /> },
  { name: "Watches", to: "/watches", icon: <MdWatch className="text-yellow-400 text-2xl mb-1" /> },
  { name: "Login", to: "/login", icon: <FaUserAlt className="text-green-400 text-2xl mb-1" /> }, // Changed
  { name: "Cart", to: "/cart", icon: <FaBoxOpen className="text-red-400 text-2xl mb-1" /> },  // Changed
  { name: "Chatbot", to: "/chatbot", icon: <IoMdChatbubbles className="text-purple-400 text-2xl mb-1" /> },
  { name: "Reviews", to: "/reviews", icon: <FaStar className="text-yellow-300 text-2xl mb-1" /> },
];

  return (
    <nav
      className={`bg-black text-white py-3 px-6 shadow-md fixed w-full top-0 z-50 transform transition-transform duration-500 ${animate ? "animate-fadeIn" : ""} ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Mobtick text on LEFT */}
        <RouterLink to="/home" className="flex items-center space-x-2">
          <img src={mobticklogo} alt="Mobtick Logo" className="h-8 w-8 rounded-full object-cover" />
          <h1 className={`text-3xl font-bold text-white transition-transform duration-300 hover:scale-105 ${animate ? "animate-fadeIn delay-100" : ""}`}>
            Mobtick
          </h1>
        </RouterLink>

        {/* Desktop Menu on RIGHT */}
       
<ul className={`hidden md:flex space-x-8 ${animate ? "animate-fadeIn delay-300" : ""}`}>
  {navItems.map((item, idx) => (
    <li key={idx} className="flex flex-col items-center group">
      <RouterLink
        to={item.to}
        className="flex flex-col items-center hover:text-gray-400 font-bold transition duration-300 cursor-pointer relative"
      >
        {item.icon}
        <span className="text-xs mt-0.5 relative inline-block">
          {item.name}
          <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </span>
      </RouterLink>
    </li>
  ))}
</ul>


        {/* Mobile Menu Button */}
        <div className={`md:hidden ${animate ? "animate-fadeIn delay-500" : ""}`}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl focus:outline-none">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
     {/* Mobile Dropdown */}
{menuOpen && (
  <div className="md:hidden mt-3 bg-gray-900 rounded-lg p-3 animate-fadeIn delay-200">
    <ul className="space-y-3 text-center">
      {navItems.map((item, idx) => (
        <li key={idx} className="group">
          <RouterLink
            to={item.to}
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-400 transition duration-300 cursor-pointer flex flex-col items-center relative"
          >
            {item.icon}
            <span className="text-xs mt-0.5 relative inline-block">
              {item.name}
              <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
          </RouterLink>
        </li>
      ))}
    </ul>
  </div>
)}

    </nav>
  );
};

export default Navbar;
