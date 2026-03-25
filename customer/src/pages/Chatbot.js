import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Generate unique userId
  const userId =
    "user_" +
    (localStorage.getItem("userId") || Math.floor(Math.random() * 10000));

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateHeader(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setBotTyping(true);
    setQuickReplies([]);

    try {
      const response = await axios.post(
        "https://mobtick-chatbot-backend.onrender.com/chat",
        {
          message,
          userId,
        }
      );

      setTimeout(() => {
        const botMessage = { sender: "bot", text: response.data.reply };
        setMessages((prev) => [...prev, botMessage]);
        setBotTyping(false);

        if (
          response.data.reply.includes("Men’s") ||
          response.data.reply.includes("Women’s")
        ) {
          setQuickReplies(["Men", "Women", "Kids"]);
        } else if (response.data.reply.includes("help you")) {
          setQuickReplies(["Watches", "Price", "Delivery"]);
        } else if (response.data.reply.includes("₹")) {
          setQuickReplies(["Under 2000", "Above 10000", "Delivery info"]);
        } else if (response.data.reply.includes("deliver")) {
          setQuickReplies(["Refund policy", "Contact support"]);
        } else if (response.data.reply.includes("refund")) {
          setQuickReplies(["Contact support", "Show watches"]);
        }

        scrollToBottom();
      }, 800);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setBotTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Could not reach chatbot server." },
      ]);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(input);
      setInput("");
    }
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black/90 text-black dark:text-white font-sans transition-all duration-500">
        {/* Navbar */}
        <header
          className={`flex items-center justify-between border-b border-black dark:border-white px-4 sm:px-6 py-2 bg-black transition-all duration-700 ${
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
              onClick={() => setDarkMode((prev) => !prev)}
              className="text-xs sm:text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded hover:opacity-80 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => navigate("/home")}
              className="text-sm sm:text-lg font-bold bg-gray-400 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 transition"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Chat Window */}
        <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-800 p-4">
          <div className="flex-1 overflow-auto mb-4 p-4 bg-white dark:bg-gray-900 rounded shadow flex flex-col">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 px-3 py-2 rounded-lg max-w-[75%] break-words shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end rounded-br-none"
                    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 self-start rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {botTyping && (
              <div className="my-2 px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 animate-pulse self-start">
                Bot is typing...
              </div>
            )}

            {quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(reply)}
                    className="px-3 py-1 rounded-md text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
            />
            <button
              onClick={() => {
                sendMessage(input);
                setInput("");
              }}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
