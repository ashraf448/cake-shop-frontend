import { motion } from "framer-motion";
import useWishlist from "../../zustand/wishlistSlice";
import useCart from "../../zustand/cartSlice";
import useAuth from "../../zustand/AuthSlice";
import { FaTrash, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlist, likeOrDislike } = useWishlist();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const handleAddToCart = (item) => {
    if (!currentUser) {
      toast.error("You must login first.🔐");
      return;
    }

    addToCart(item);
    toast.success("Added to cart 🛒");
  };

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mt-20"
      >
        <FaHeart className="text-gray-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">
          Wishlist is empty 💔
        </h2>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {wishlist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
            className="bg-white rounded-2xl shadow-md p-4 relative flex flex-col"
          >
            {/* Remove */}
            <button
              onClick={() => likeOrDislike(item)}
              className="absolute top-3 right-3 text-red-500"
            >
              <FaTrash />
            </button>

            {/* Image */}
            <img
              src={item.image}
              className="h-40 mx-auto object-contain"
            />

            {/* Info */}
            <h2 className="mt-3 font-semibold">{item.title}</h2>
            <p className="text-green-600 mb-3">${item.price}</p>

            {/* Buttons */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleAddToCart(item)}
                disabled={item.stock === 0}
                className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
              >
                Add
              </button>

              <Link
                to={`/product/${item.id}`}
                className="w-full border text-center border-black py-2 rounded-xl hover:bg-black hover:text-white transition"
              >
                Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}