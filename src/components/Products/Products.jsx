

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useDisplay from "../../zustand/displaySlice";
import ProductCart from "../../common/dynamic/ProductCart";
import ProductSkeleton from "../ui/ProductSkeleton";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getAllProducts = useDisplay((s) => s.getAllProducts);
  const allProducts   = useDisplay((s) => s.allProducts);
  const isLoading     = useDisplay((s) => s.isLoading);

  const [search,   setSearch]   = useState(searchParams.get("search") || "");
  const [sort,     setSort]     = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [page,     setPage]     = useState(1);
  const limit = 12;

  const isFeatured = searchParams.get("featured") === "true";
  const category = searchParams.get("category");
  const normalizedCategory = category;

  useEffect(() => { getAllProducts(); }, []);

  const clearCategory = () => {
    const p = new URLSearchParams(searchParams);
    p.delete("category");
    p.delete("featured");
    setSearchParams(p);
    setPage(1);
  };
  const categories = useMemo(() => {
  const set = new Set();

  allProducts.forEach(p => {
    if (p.category) set.add(p.category);
  });

  return [...set];
}, [allProducts]);

  // ── Filter engine ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...allProducts];

    // featured filter
    if (isFeatured && !category) {
  data = data.filter(p => p.isFeatured);
}

    // category filter
    if (normalizedCategory) {
      data = data.filter(p => p.category?.toLowerCase() === normalizedCategory);
    }

    // search
    if (search) {
      data = data.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
    }

    // price filter
    data = data.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // sort
    if (sort === "low")  data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);

    return data;
  }, [allProducts, search, minPrice, maxPrice, sort, normalizedCategory, isFeatured]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated  = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="py-16 px-5 md:px-20">

      {/* Header */}
      {isFeatured && (
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold">⭐ Featured Products</h1>
          <button onClick={clearCategory}
            className="text-sm text-gray-500 hover:text-black underline">
            Show All Products
          </button>
        </div>
      )}

      {/* CATEGORY BUTTONS */}
      {/* CATEGORY BUTTONS */}
<div className="flex flex-wrap gap-3 mb-6">
  
  {/* All */}
  {(category || isFeatured) && (
    <button
      onClick={clearCategory}
      className="px-4 py-2 rounded bg-gray-200 text-sm"
    >
      All Products
    </button>
  )}

  {/* Categories */}
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        params.set("category", cat);
        setSearchParams(params);
        setPage(1);
      }}
      className={`px-4 py-2 rounded capitalize text-sm ${
        category === cat
          ? "bg-black text-white"
          : "bg-gray-200"
      }`}
    >
      {cat}
    </button>
  ))}
</div>

      {/* FILTERS */}
      <div className="flex flex-wrap flex-col w-[50%] items-start gap-5 mb-8 ">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-lg flex-1 w-full min-w-45"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="border p-2 rounded-lg w-[50%]" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Default</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">EGP</span>
          <input type="number" placeholder="Min" min={0}
            className="border p-2 rounded-lg  text-sm w-full"
            onChange={e => { setMinPrice(Number(e.target.value) || 0); setPage(1); }} />
          <span className="text-gray-400">—</span>
          <input type="number" placeholder="Max" min={0}
            className="border p-2 rounded-lg  text-sm w-full"
            onChange={e => { setMaxPrice(Number(e.target.value) || 99999); setPage(1); }} />
        </div>
      </div>

      {/* PRODUCTS */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p>{isFeatured ? "No featured products yet." : "No products found."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {paginated.map(p => <ProductCart key={p._id || p.id} {...p} />)}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {page > 1 && (
            <button onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100">← Prev</button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-xl border ${p === page ? "bg-black text-white" : "hover:bg-gray-100"}`}>
              {p}
            </button>
          ))}
          {page < totalPages && (
            <button onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100">Next →</button>
          )}
        </div>
      )}
    </div>
  );
}