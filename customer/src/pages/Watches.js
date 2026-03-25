// src/pages/WatchesPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsWatch } from "react-icons/bs"; // Men
import { GiWatch } from "react-icons/gi"; // Women
import { MdOutlineWatch } from "react-icons/md"; // Unisex
import mobticklogo from "../assets/mobticklogo.png";

const Watches = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [animateMain, setAnimateMain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateHeader(true), 100);
    const timer2 = setTimeout(() => setAnimateMain(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative min-h-screen bg-gray-100 dark:bg-black/90 text-gray-900 dark:text-white font-sans transition-all duration-500">
        
        {/* ✅ Navbar (exactly like Chatbot) */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white 
                      px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
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
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 
                         text-white dark:text-black px-3 py-1 rounded 
                         hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => navigate("/home")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 
                         rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Main Section */}
        <main
          className={`container mx-auto px-6 py-12 transition-all duration-700 ${
            animateMain ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-10 text-center">
            Explore Our Collections
          </h2>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Men’s Watches */}
            <div
              className="group w-full h-72 sm:h-80 bg-white dark:bg-gray-800 
                         border-2 border-transparent dark:border-white rounded-xl 
                         shadow-lg p-6 flex flex-col items-center justify-center 
                         text-center hover:scale-105 transform transition-all duration-300"
            >
              <BsWatch className="text-gray-500 dark:text-gray-300 text-7xl mb-4 group-hover:text-blue-500 transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">Men’s Watches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stylish and premium watches crafted for men. Perfect for every occasion.
              </p>
              <Link to="/men">

              <button className="mt-5 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                View Men’s Collection
              </button>
             </Link>

            </div>

            {/* Women’s Watches */}
            <div
              className="group w-full h-72 sm:h-80 bg-white dark:bg-gray-800 
                         border-2 border-transparent dark:border-white rounded-xl 
                         shadow-lg p-6 flex flex-col items-center justify-center 
                         text-center hover:scale-105 transform transition-all duration-300"
            >
              <GiWatch className="text-gray-500 dark:text-gray-300 text-7xl mb-4 group-hover:text-pink-500 transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">Women’s Watches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Elegant, classy, and trendy watches for women to match every style.
              </p>
              <Link to="/women">

              <button className="mt-5 px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                View Women’s Collection
              </button>
              </Link>
            </div>

            {/* Unisex Watches */}
            <div
              className="group w-full h-72 sm:h-80 bg-white dark:bg-gray-800 
                         border-2 border-transparent dark:border-white rounded-xl 
                         shadow-lg p-6 flex flex-col items-center justify-center 
                         text-center hover:scale-105 transform transition-all duration-300"
            >
              <MdOutlineWatch className="text-gray-500 dark:text-gray-300 text-7xl mb-4 group-hover:text-green-500 transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">Unisex Watches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Smartwatches and couple watches designed for everyone.
              </p>
               <Link to="/unisex">

              <button className="mt-5 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                View Unisex Collection
              </button>
               </Link>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Watches;