


// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import { motion } from "framer-motion";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import useCart from "../../zustand/cartSlice";
// import useWishlist from "../../zustand/wishlistSlice";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";

// export default function Offers() {
//   const navigate = useNavigate();
//   const { addToCart }                   = useCart();
//   const { likeOrDislike, isInWishlist } = useWishlist();

//   const [products, setProducts] = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [offerInfo, setOfferInfo] = useState({ discount: 20, label: "20% Discount On All Discounted Products" });

//   // ── Countdown 24h ─────────────────────────────────────────────────────────
//   const [targetDate] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
//   const [time, setTime] = useState(targetDate - Date.now());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const diff = targetDate - Date.now();
//       if (diff <= 0) { clearInterval(timer); setTime(0); }
//       else setTime(diff);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [targetDate]);

//   const format = (n) => String(n).padStart(2, "0");
//   const hours   = format(Math.floor(time / (1000 * 60 * 60)));
//   const minutes = format(Math.floor((time / (1000 * 60)) % 60));
//   const seconds = format(Math.floor((time / 1000) % 60));

//   // ── جيب المنتجات اللي عندها discount من الباك ──────────────────────────────
//   useEffect(() => {
//     fetch("/api/products?limit=20&sort=-discount")
//       .then(r => r.json())
//       .then(data => {
//         const discounted = (data.products || []).filter(p => (p.discount || 0) > 0);
//         setProducts(discounted);

//         // حساب أعلى discount موجودة
//         if (discounted.length > 0) {
//           const maxDiscount = Math.max(...discounted.map(p => p.discount));
//           setOfferInfo({
//             discount: maxDiscount,
//             label:    `Up to ${maxDiscount}% Off Selected Products`,
//           });
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const handleAdd = (item) => {
//     addToCart({
//       ...item,
//       _id:      item._id || item.id,
//       price:    item.price,
//       discount: item.discount || 0,
//       stock:    item.stock,
//     });
//     toast.success("Added to cart 🛒");
//   };

//   // لو مفيش منتجات بـ discount مش نعرض السكشن
//   if (!loading && products.length === 0) return null;

//   return (
//     <section className="p-6 md:p-10 bg-[#f8f5f0]">

//       {/* Banner */}
//       <motion.div
//         initial={{ opacity:0, y:40 }}
//         animate={{ opacity:1, y:0 }}
//         className="relative flex flex-col md:flex-row justify-between items-center p-6 md:p-8 rounded-2xl bg-linear-to-r from-[#54844D] to-[#496D72] text-white mb-10 gap-5"
//       >
//         <div>
//           <p className="text-2xl md:text-3xl font-bold">🔥 Offer Of The Day</p>
//           <p className="mt-2">{offerInfo.label}</p>
//           <div className="text-xl font-bold mt-3 tracking-widest">
//             {hours}:{minutes}:{seconds}
//           </div>
//           <button
//             onClick={() => navigate("/products")}
//             className="mt-4 bg-[#D0BFA5] text-black px-5 py-2 rounded-lg hover:scale-105 transition"
//           >
//             Shop Now
//           </button>
//         </div>
//         <div className="absolute top-3 right-3 bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-sm">
//           {offerInfo.discount}% OFF
//         </div>
//       </motion.div>

//       {/* Slider */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {[1,2,3].map(i => (
//             <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
//           ))}
//         </div>
//       ) : (
//         <Swiper
//           loop
//           spaceBetween={20}
//           autoplay={{ delay:2500, disableOnInteraction:false, pauseOnMouseEnter:true }}
//           modules={[Autoplay]}
//           breakpoints={{ 0:{slidesPerView:1}, 640:{slidesPerView:2}, 1024:{slidesPerView:3} }}
//         >
//           {products.map((item) => {
//             const isFav       = isInWishlist(item._id || item.id);
//             const finalPrice  = item.price - (item.price * (item.discount || 0)) / 100;
//             const allImgs     = item.images?.length ? item.images : item.image ? [item.image] : [];
//             const imgSrc      = allImgs[0] || "";

//             return (
//               <SwiperSlide key={item._id || item.id}>
//                 <motion.div
//                   whileHover={{ scale:1.05 }}
//                   className="bg-white p-4 rounded-xl relative shadow hover:shadow-xl transition"
//                 >
//                   {/* Wishlist */}
//                   <button onClick={() => likeOrDislike(item)} className="absolute top-3 right-3 text-xl z-10">
//                     {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
//                   </button>

//                   {/* Discount badge */}
//                   <span className="absolute top-2 -left-1 bg-[#54844D] text-white px-3 py-1 text-xs rounded-r-lg font-bold">
//                     -{item.discount}%
//                   </span>

//                   {/* Image */}
//                   <div className="overflow-hidden rounded-lg cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
//                     {imgSrc ? (
//                       <img src={imgSrc} alt={item.title}
//                         className="w-full h-56 object-cover hover:scale-110 transition duration-300" />
//                     ) : (
//                       <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-5xl">🎂</div>
//                     )}
//                   </div>

//                   <p className="font-bold mt-3 truncate">{item.title}</p>

//                   <p className="mt-1">
//                     <span className="line-through text-gray-400 mr-2">EGP {item.price}</span>
//                     <span className="text-green-600 font-bold">EGP {finalPrice.toFixed(0)}</span>
//                   </p>

//                   <button
//                     onClick={() => handleAdd(item)}
//                     disabled={item.stock === 0}
//                     className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
//                   >
//                     {item.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
//                   </button>
//                 </motion.div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       )}
//     </section>
//   );
// }



import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useCart from "../../zustand/cartSlice";
import useWishlist from "../../zustand/wishlistSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "swiper/css";

export default function Offers() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { likeOrDislike, isInWishlist } = useWishlist();

  const [products,  setProducts]  = useState([]);
  const [offerInfo, setOfferInfo] = useState({ discount:20, label:"Offer Of The Day", isActive:true });
  const [time,      setTime]      = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    fetch("/api/offer-settings")
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          setOfferInfo({
            discount: data.settings.discount  || 20,
            label:    data.settings.label     || "Offer Of The Day",
            isActive: data.settings.isActive  !== false,
          });
          if (data.settings.expiresAt) {
            const exp = new Date(data.settings.expiresAt);
            setExpiresAt(exp);
            setTime(Math.max(0, exp - Date.now()));
          }
        }
      }).catch(() => {});

    fetch("/api/products?limit=20&sort=-discount")
      .then(r => r.json())
      .then(data => setProducts((data.products || []).filter(p => (p.discount || 0) > 0)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const diff = Math.max(0, expiresAt - Date.now());
      setTime(diff);
      if (diff === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const pad = (n) => String(n).padStart(2, "0");
  const hours   = pad(Math.floor(time / 3600000));
  const minutes = pad(Math.floor((time % 3600000) / 60000));
  const seconds = pad(Math.floor((time % 60000) / 1000));

  if (!offerInfo.isActive || products.length === 0) return null;

  return (
    <section className="p-6 md:p-10 bg-[#f8f5f0]">
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        className="relative flex flex-col md:flex-row justify-between items-center p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#54844D] to-[#496D72] text-white mb-10 gap-5">
        <div>
          <p className="text-2xl md:text-3xl font-bold">🔥 {offerInfo.label}</p>
          <p className="mt-2">{offerInfo.discount}% Discount On Discounted Products</p>
          {expiresAt && (
            <div className="text-xl font-bold mt-3 tracking-widest">{hours}:{minutes}:{seconds}</div>
          )}
          <button onClick={() => navigate("/products")}
            className="mt-4 bg-[#D0BFA5] text-black px-5 py-2 rounded-lg hover:scale-105 transition">
            Shop Now
          </button>
        </div>
        <div className="absolute top-3 right-3 bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-sm">
          {offerInfo.discount}% OFF
        </div>
      </motion.div>

      <Swiper loop spaceBetween={20}
        autoplay={{ delay:2500, disableOnInteraction:false, pauseOnMouseEnter:true }}
        modules={[Autoplay]}
        breakpoints={{ 0:{slidesPerView:1}, 640:{slidesPerView:2}, 1024:{slidesPerView:3} }}>
        {products.map((item) => {
          const isFav      = isInWishlist(item._id || item.id);
          const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
          const imgSrc     = item.images?.[0] || item.image || "";
          return (
            <SwiperSlide key={item._id || item.id}>
              <motion.div whileHover={{ scale:1.05 }}
                className="bg-white p-4 rounded-xl relative shadow hover:shadow-xl transition">
                <button onClick={() => likeOrDislike(item)} className="absolute top-3 right-3 text-xl z-10">
                  {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
                <span className="absolute top-2 -left-1 bg-[#54844D] text-white px-3 py-1 text-xs rounded-r-lg font-bold">
                  -{item.discount}%
                </span>
                <div className="overflow-hidden rounded-lg cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                  {imgSrc
                    ? <img src={imgSrc} alt={item.title} className="w-full h-56 object-cover hover:scale-110 transition duration-300" />
                    : <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-5xl">🎂</div>
                  }
                </div>
                <p className="font-bold mt-3 truncate">{item.title}</p>
                <p className="mt-1">
                  <span className="line-through text-gray-400 mr-2">EGP {item.price}</span>
                  <span className="text-green-600 font-bold">EGP {finalPrice.toFixed(0)}</span>
                </p>
                <button onClick={() => { addToCart({...item, _id:item._id||item.id}); toast.success("Added 🛒"); }}
                  disabled={item.stock === 0}
                  className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
                  {item.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
                </button>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}