
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCart from "../../common/dynamic/ProductCart";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/products/featured")
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <div className="py-16 px-4 md:px-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">⭐ Featured Products</h2>
          <p className="text-gray-400 text-sm mt-1">Hand-picked by our team just for you</p>
        </div>
        {/* View All → يروح لصفحة المنتجات المفضلة فقط */}
        <button
          onClick={() => navigate("/products?featured=true")}
          className="text-sm text-white bg-black hover:bg-white border-2 p-3 rounded-2xl hover:text-black transition"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))
          : products.map(p => <ProductCart key={p._id || p.id} {...p} />)
        }
      </div>
    </div>
  );
}