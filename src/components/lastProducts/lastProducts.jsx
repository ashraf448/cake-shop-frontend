import { useEffect, useState } from "react";
import useDisplay from "../../zustand/displaySlice";
import ProductCart from "../../common/dynamic/ProductCart";
import ProductSkeleton from "../ui/ProductSkeleton";
import { useParams, useNavigate } from "react-router-dom";

export default function Products() {
  const getAllProducts = useDisplay((s) => s.getAllProducts);
  const allProducts = useDisplay((s) => s.allProducts);
  const setCategory = useDisplay((s) => s.setCategory);

  const { category } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getAllProducts();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCategory(category);
  }, [category]);

  // 🔥 أحدث منتجات (8 فقط)
  const visibleProducts = [...allProducts].reverse().slice(0, 8);

  return (
    <div className="py-16 px-4 md:px-20">

      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
        Last Products
      </h2>

      {/* ✅ Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          : visibleProducts.map((el) => (
              <ProductCart key={el.id} {...el} />
            ))}

      </div>

      {/* 🔥 زرار */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 text-sm md:text-base bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          View All Products →
        </button>
      </div>

    </div>
  );
}