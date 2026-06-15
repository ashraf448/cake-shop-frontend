import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .catch(() => {});
  }, []);

  // fallback لو مفيش reviews في الباك لسه
  const displayReviews = reviews.length > 0 ? reviews : [
    { _id:"1", name:"أحمد",   message:"أفضل كيك جربته في حياتي 😍",              rating:5 },
    { _id:"2", name:"فاطمة", message:"التوصيل سريع جدًا والطعم خرافي 🔥",       rating:5 },
    { _id:"3", name:"محمد",  message:"الكيك طازة جدًا والخدمة ممتازة 👌",        rating:5 },
  ];

  return (
    <section className="py-16 bg-[#D0BFA5] text-center">
      <p className="text-3xl font-bold mb-10">⭐ Customer Opinions</p>

      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        autoplay={{ delay:3000, disableOnInteraction:false }}
        breakpoints={{ 320:{ slidesPerView:1 }, 768:{ slidesPerView:2 } }}
        modules={[Autoplay]}
      >
        {displayReviews.map(rev => (
          <SwiperSlide key={rev._id}>
            <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition mx-2">

              {/* Stars */}
              <div className="text-yellow-400 text-xl mb-2">
                {"★".repeat(rev.rating || 5)}{"☆".repeat(5 - (rev.rating || 5))}
              </div>

              {/* Image */}
              {rev.image && (
                <img src={rev.image} alt={rev.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-pink-200" />
              )}

              <p className="mb-3 text-gray-700">{rev.message}</p>
              <p className="font-bold text-[#496D72]">{rev.name}</p>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
