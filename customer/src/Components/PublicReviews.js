import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const PublicReviews = ({ reviews }) => {
  return (
    <section className="py-16 px-6 bg-white overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
        What Our Customers Say
      </h2>

      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((rev, index) => (
            <SwiperSlide key={index} className="flex h-full">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="bg-black rounded-2xl shadow-2xl p-6 border border-gray-700 
                           hover:shadow-yellow-500/40 transition-transform duration-200 
                           flex flex-col justify-between h-full w-full min-h-[150px]"
              >
                {/* Rating */}
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-6 w-6 ${
                        i < rev.rating ? "text-yellow-400" : "text-gray-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-200 italic leading-relaxed text-lg flex-grow">
                  "{rev.comment}"
                </p>

                {/* User */}
                <div className="mt-6 flex items-center justify-end">
                  <p className="font-semibold text-white">- {rev.user}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PublicReviews;
