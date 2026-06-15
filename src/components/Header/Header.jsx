

import { useEffect, useState } from "react";
import banner1 from "../../assets/images/1.jpeg";
import banner2 from "../../assets/images/2.jpeg";
import banner3 from "../../assets/images/3.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const DEFAULT_SETTINGS = {
  title:    "Delicious Cakes For Every Occasion 🎂",
  subtitle: "Freshly baked cakes with premium ingredients. Perfect for birthdays, weddings and more.",
  badge:    "20% OFF",
  btnShop:  "Shop Now",
  btnLearn: "Learn More",
  slides: [
    { title: "Special Cake",   image: banner1 },
    { title: "Wedding Cake",   image: banner2 },
    { title: "Birthday Cake",  image: banner3 },
  ],
};

export default function Hero() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/hero")
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          const s = data.settings;
          setSettings({
            title:    s.title    || DEFAULT_SETTINGS.title,
            subtitle: s.subtitle || DEFAULT_SETTINGS.subtitle,
            badge:    s.badge    || DEFAULT_SETTINGS.badge,
            btnShop:  s.btnShop  || DEFAULT_SETTINGS.btnShop,
            btnLearn: s.btnLearn || DEFAULT_SETTINGS.btnLearn,
            slides:   s.slides?.length ? s.slides : DEFAULT_SETTINGS.slides,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-linear-to-br from-rose-50 via-amber-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT - Main Hero (Modern Card) */}
          <div className="group relative h-87.5 sm:h-112.5 md:h-137.5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl">
            {/* Background image with zoom effect */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${settings.slides[0]?.image || banner1})` }}
            />
            {/* Gradient overlay (sleeker) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-8 pb-10 text-white">
              <span className="inline-block text-amber-300 text-sm md:text-base font-semibold tracking-wider uppercase mb-2">
                Amira Cake Designer ✨
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                {settings.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-200 max-w-md leading-relaxed">
                {settings.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2.5 md:px-8 md:py-3 bg-amber-400 text-gray-900 font-bold rounded-full shadow-lg transition-all hover:bg-amber-300 hover:scale-105 hover:shadow-amber-400/50"
                >
                  🛒 {settings.btnShop}
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-white/80 text-white font-bold rounded-full backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900"
                >
                  📖 {settings.btnLearn}
                </button>
              </div>
            </div>

            {/* Badge */}
            {settings.badge && (
              <div className="absolute top-5 left-5 z-20 bg-linear-to-r from-rose-500 to-amber-500 text-white text-sm md:text-base font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                🔥 {settings.badge}
              </div>
            )}
          </div>

          {/* RIGHT - Enhanced Slider */}
          <div className="h-70 sm:h-95 lg:h-137.5 rounded-3xl overflow-hidden shadow-2xl">
            <Swiper
              className="w-full h-full"
              modules={[Autoplay, Navigation, Pagination, EffectFade]}
              effect="fade"
              loop
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              speed={800}
            >
              {settings.slides.map((el, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full group overflow-hidden">
                    <img
                      src={el.image || banner1}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={el.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-8 text-white">
                      <div className="transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg">
                          {el.title}
                        </h2>
                        <button
                          onClick={() => navigate("/products")}
                          className="mt-3 px-5 py-2 bg-amber-400 text-gray-900 font-semibold rounded-full shadow-md hover:bg-amber-300 transition-all hover:scale-105"
                        >
                          {settings.btnShop} →
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-white">
                      New
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
}