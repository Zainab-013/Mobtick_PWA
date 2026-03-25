import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ add this

// Import images
import watch1 from "../assets/watch1.jpg";
import watch2 from "../assets/watch2.jpg";
import watch3 from "../assets/watch3.jpg";
const slides = [
  {
    brand: "Fossil",
    desc: "Elegance that lasts forever.",
    offer: "20% OFF",
    discount: "Limited Time Deal!",
    img: watch1,
    price: 15000,
    discountedPrice: 15000 * 0.8, // 20% off
  },
  {
    brand: "Omega",
    desc: "Luxury crafted for perfection.",
    offer: "15% OFF",
    discount: "Special Festive Discount!",
    img: watch2,
    price: 25000,
    discountedPrice: 25000 * 0.85, // 15% off
  },
  {
    brand: "Rolex",
    desc: "Style meets timeless design.",
    offer: "30% OFF",
    discount: "Exclusive Online Offer!",
    img: watch3,
    price: 50000,
    discountedPrice: 50000 * 0.7, // 30% off
  },
];


const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [typedBrand, setTypedBrand] = useState("");
  const navigate = useNavigate(); // ✅

  // Auto slide every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Typing effect for brand name
  useEffect(() => {
    setTypedBrand(""); // reset first
    let i = 0;
    const typing = setInterval(() => {
      if (i <= slides[current].brand.length) {
        setTypedBrand(slides[current].brand.substring(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 150);
    return () => clearInterval(typing);
  }, [current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // ✅ Buy Now handler
  // ✅ Buy Now handler
const handleBuyNow = (slide) => {
  const productForBuyNow = {
    name: slide.brand,
    image: slide.img,
    price: slide.discountedPrice,
    quantity: 1,
    description: slide.desc, // ✅ include description
    offer: slide.offer,      // optional: if you want offer too
    discount: slide.discount // optional: if you want discount too
  };

  navigate("/buynow", { state: { product: productForBuyNow } });
};



  return (
    <section className="relative w-full bg-white pt-[80px]">
      {/* Top Deals Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
         Top Deals and Discounts
      </h2>

      {/* Slider Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20"
            >
              {/* Left Side Text */}
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 md:space-y-4 text-center md:text-left pl-0 md:pl-16 lg:pl-24 order-2 md:order-1 mt-4 md:mt-0">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                  {typedBrand}
                  <span className="animate-pulse">|</span>
                </h3>
                <p className="text-base sm:text-lg md:text-2xl text-gray-600">{slide.desc}</p>

                {/* Offer & Discount */}
                <div className="space-y-1">
                  <p className="text-red-600 font-bold text-xl sm:text-2xl animate-bounce">
                    {slide.offer}
                  </p>
                  <p className="text-green-600 text-base sm:text-xl italic animate-pulse">
                    {slide.discount}
                  </p>
                </div>

                {/* ✅ Buy Now Button */}
                <button
                  onClick={() => handleBuyNow(slide)}
                  className="bg-black text-white w-28 sm:w-32 py-3 sm:py-4 rounded-full shadow-md hover:scale-105 hover:bg-gray-800 transition-all duration-300 mx-auto md:mx-0"
                >
                  Buy Now
                </button>
              </div>

              {/* Right Side Image */}
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                <img
                  src={slide.img}
                  alt={slide.brand}
                  className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Prev Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 p-2 rounded-full text-xl"
        >
          <FaChevronLeft />
        </button>

        {/* Next Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-300 hover:bg-gray-400 p-2 rounded-full text-xl"
        >
          <FaChevronRight />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index ? "bg-black scale-125" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
