import { Link } from "react-router-dom";
import useWishlist from "../../zustand/wishlistSlice";
import useCart from "../../zustand/cartSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductCart({
  id,
  title,
  price,
  image,
  discount,
  stock,
}) {
  // ✅ hook داخل component فقط
  const { likeOrDislike, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFav = isInWishlist(id);
  const handleAddToCart = () => {
    addToCart({ id, title, price, image, discount, stock });

    // toast.success("Added to cart 🛒");
  };
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden relative group">
      {/* ❤️ Wishlist */}
      <button
        onClick={() =>
          likeOrDislike({ id, title, price, image, discount, stock })
        }
        className="absolute top-3 right-3 text-xl"
      >
        {isFav ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-600" />
        )}
      </button>

      {/* Image */}
      <div className="bg-gray-100 p-5 flex justify-center items-center">
        <img
          src={image}
          alt={title}
          className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-lg font-semibold line-clamp-2 mb-2">{title}</p>

        <p className="text-green-600 font-bold text-lg mb-4">${price}</p>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            Add to Cart
          </button>

          <Link
            to={`/product/${id}`}
            className="w-full border text-center border-black py-2 rounded-xl hover:bg-black hover:text-white transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
