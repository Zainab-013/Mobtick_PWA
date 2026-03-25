// src/pages/ThankYou.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mobticklogo from "../assets/mobticklogo.png";
import jsPDF from "jspdf";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderDetails = location.state?.orderDetails || {
    product: "Watch",
    amount: "15999",
    date: new Date().toLocaleString(),
    orderId: "ORDER" + Date.now()
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MOBTICK RECEIPT", 70, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Order ID: ${orderDetails.orderId}`, 20, 40);
    doc.text(`Product: ${orderDetails.product}`, 20, 50);
    doc.text(`Amount: ₹${orderDetails.amount}`, 20, 60);
    doc.text(`Date: ${orderDetails.date}`, 20, 70);

    doc.setDrawColor(0, 255, 0); // Green
    doc.line(20, 80, 180, 80);

    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69); // Bootstrap Green
    doc.text("Thank you for your purchase!", 20, 95);

    doc.save(`receipt_${orderDetails.orderId}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-600 dark:from-black dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <img src={mobticklogo} alt="MOBTICK Logo" className="w-16 h-16 rounded-full mb-4" />
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Thank You!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
          Your order has been placed successfully.<br />
          We appreciate your purchase!
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
          >
            Download Receipt (PDF)
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
