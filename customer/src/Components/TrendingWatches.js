import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrendingWatches = ({ deals }) => {
  const navigate = useNavigate();
  const [selectedWatch, setSelectedWatch] = useState(null); // modal state

  // Keep this one because it's used
 const handleAddToCart = (watch) => {
  navigate("/cart", { 
    state: { 
      newItem: {
        id: watch.id || Date.now() + Math.random(), // ensure unique ID
        name: watch.brandName,
        price: watch.price,
        image: watch.imageUrl,
        description: watch.description,
        discount: watch.discount,
        quantity: 1
      } 
    } 
  });
};

  return (
    <div className="trending-section">
      
      {/* Horizontal scrollable cards */}
      <div className="flex overflow-x-auto gap-6 pb-4">
        {deals.map((watch, index) => (
          <div
            key={index}
            onClick={() => setSelectedWatch(watch)} // pass full watch
            className="w-64 sm:w-72 md:w-60 lg:w-64 border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer flex-shrink-0 bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <img
              src={watch.imageUrl}
              alt={watch.brandName}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold dark:text-white">{watch.brandName}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{watch.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xl font-bold text-green-600">₹{watch.price}</span>
              {watch.discount > 0 && (
                <span className="text-red-500 font-medium">{watch.discount}% OFF</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedWatch && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 dark:text-gray-300"
              onClick={() => setSelectedWatch(null)}
            >
              ✕
            </button>

            <img
              src={selectedWatch.imageUrl}
              alt={selectedWatch.brandName}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold">{selectedWatch.brandName}</h2>
            <p className="text-green-600 dark:text-green-400 font-semibold">
              ₹{selectedWatch.price}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {selectedWatch.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
              {/* Buy Now */}
              <button
                onClick={() =>
                  navigate("/buynow", {
                    state: {
                      product: {
                        id: selectedWatch.id,
                        name: selectedWatch.brandName,
                        price: selectedWatch.price,
                        image: selectedWatch.imageUrl,
                        description: selectedWatch.description,
                        discount: selectedWatch.discount,
                      },
                    },
                  })
                }
                className="flex-1 w-1/2 px-6 text-white bg-black dark:bg-gray-800 border dark:border-gray-600 dark:text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition"
              >
                Buy Now
              </button>

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(selectedWatch)}
                className="flex-1 w-1/2 px-6 text-white bg-gray-600 dark:bg-gray-700 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingWatches;
