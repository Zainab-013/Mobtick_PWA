// src/Components/Footer.js
import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* Brand & Slogan */}
        <div className="text-center md:text-left animate-fadeIn delay-100">
          <h2 className="text-2xl font-bold text-white mb-2">Mobtick</h2>
          <p className="text-white hover:text-gray-400 italic">"Timeless Watches, Timeless Style"</p>
        </div>

        {/* Quick Links */}
        <div className="text-center animate-fadeIn delay-300">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { name: "Home", link: "/" },
              { name: "Watches", link: "/watches" },
              { name: "Login", link: "/login" },
              { name: "Cart", link: "/cart" },
              { name: "Chatbot", link: "/chatbot" },
               { name: "Reviews", link: "/reviews" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="relative group inline-block text-white hover:text-gray-400 transition duration-300"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-right animate-fadeIn delay-500">
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <div className="space-y-2">
            <p className="flex justify-center md:justify-end items-center text-white gap-2 hover:text-gray-400 transition duration-300">
              <FaMapMarkerAlt className="text-red-500" />
              Mumbai, India
            </p>
            <p className="flex justify-center md:justify-end items-center text-white gap-2 hover:text-gray-400 transition duration-300">
              <FaEnvelope className="text-blue-400" />
              support@mobtick.com
            </p>
            <p className="flex justify-center md:justify-end items-center text-white gap-2 hover:text-gray-400 transition duration-300">
              <FaPhoneAlt className="text-green-400" />
              +91 98765 43210
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500 animate-fadeIn delay-700">
        © {new Date().getFullYear()} Mobtick. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
