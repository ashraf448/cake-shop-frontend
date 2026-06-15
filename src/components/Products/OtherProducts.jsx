

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDisplay from "../../zustand/displaySlice";
import ProductCart from "../../common/dynamic/ProductCart";
import ProductSkeleton from "../ui/ProductSkeleton";

export default function OtherProducts() {
  const getAllProducts = useDisplay((s) => s.getAllProducts);
  const allProducts = useDisplay((s) => s.allProducts);

  const navigate = useNavigate();

  // id + category من الرابط
  const { id, category } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getAllProducts();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // منتجات من نفس الـ category
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          p.category?.toLowerCase() == 'Other Products'?.toLowerCase() &&
          (p._id || p.id) !== id
      )
      .slice(0, 8);
  }, [allProducts, category, id]);

  return (
    <div className="py-16 px-4 md:px-20">

      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
        Other Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : relatedProducts.length === 0 ? (
          <div className="col-span-4 text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📦</div>
            <p>No related products found.</p>
          </div>
        ) : (
          relatedProducts.map((product) => (
            <ProductCart
              key={product._id || product.id}
              {...product}
            />
          ))
        )}

      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() =>
  navigate("/products?category=Other Products")
}
          className="px-6 py-3 text-sm md:text-base bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          View All Products →
        </button>
      </div>

    </div>
  );
}