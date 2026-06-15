


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../zustand/AuthSlice";

import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import useCart from "../../zustand/cartSlice";
import useWishlist from "../../zustand/wishlistSlice";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { likeOrDislike, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ NEW
  const [customDetails, setCustomDetails] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data.product || res.data;

        setProduct(p);
        setQty(1);
        setCurrentIndex(0);

        // ✅ reset details when changing product
        setCustomDetails("");
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return (
      <h2 className="text-center mt-10 text-xl">
        Loading...
      </h2>
    );
  }

  // ALL IMAGES
  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const isFav = isInWishlist(product._id || product.id);

  // PRICE
  const basePrice =
    product.price -
    (product.price * (product.discount || 0)) / 100;

  const finalPrice = basePrice * qty;

  // ADD TO CART
  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.id,
      _id: product._id || product.id,

      title: product.title,

      image: product.image || images[0],

      price: product.price,
      discount: product.discount || 0,
      stock: product.stock,

      qty,
      finalPrice,

      // ✅ SEND CUSTOMER DETAILS
      customDetails,
    });

    toast.success("Added to cart 🛒");
  };

  // SLIDER
  const goNext = () =>
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );

  const goPrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  return (
    <div className="relative container mx-auto px-4 py-6">

      {/* CLOSE */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        ✕
      </button>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-3xl shadow-xl">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex flex-col gap-4">

          {/* MAIN IMAGE */}
          <div
            className="relative flex justify-center items-center bg-gray-50 rounded-2xl overflow-hidden"
            style={{ height: 380 }}
          >

            {images.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-3 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
              >
                <FaChevronLeft />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={images[currentIndex]}
                src={images[currentIndex]}
                alt={product.title}
                className="object-contain"
                style={{
                  maxHeight: 360,
                  maxWidth: "100%",
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
              >
                <FaChevronRight />
              </button>
            )}

            {/* COUNTER */}
            {images.length > 1 && (
              <span
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 12,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap justify-center">

              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    overflow: "hidden",
                    border:
                      i === currentIndex
                        ? "3px solid #ec4899"
                        : "2px solid #e5e7eb",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "border-color 0.15s",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              ))}

            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex flex-col gap-5">

          {/* TITLE */}
          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-500">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="text-2xl font-bold text-pink-600">

            EGP {finalPrice.toFixed(2)}

            {product.discount > 0 && (
              <span className="text-base font-normal text-gray-400 line-through ml-3">
                EGP {product.price}
              </span>
            )}

          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                qty > 1 && setQty(qty - 1)
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() =>
                qty < product.stock &&
                setQty(qty + 1)
              }
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>

            <span className="text-sm text-gray-400">
              ({product.stock} in stock)
            </span>

          </div>

          {/* ✅ CUSTOMER DETAILS */}
          <div className="flex flex-col gap-2">

            <label className="font-semibold text-sm">
              Additional Details
            </label>

            <textarea
              value={customDetails}
              onChange={(e) =>
                setCustomDetails(e.target.value)
              }
              placeholder="Write cake details, colors, names, message on cake..."
              className="w-full min-h-30 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />

          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-pink-500 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add To Cart"}
          </button>

          {/* WISHLIST */}
          <button
            onClick={() => likeOrDislike(product)}
            className="text-2xl"
          >
            {isFav ? (
              <FaHeart color="red" />
            ) : (
              <FaRegHeart />
            )}
          </button>

        </div>
      </div>
    </div>
  );
}