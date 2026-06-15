
import { create } from "zustand";
import { api } from "./AuthSlice";

const useDisplay = create((set, get) => ({

  allProducts: [],
  categories: [],
  selectedCategory: "all",
  isLoading: false,
  error: null,

  // =========================
  // GET ALL PRODUCTS
  // =========================

  getAllProducts: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      // الباك بيقبل: search, category, sort, page, limit
      const { data } = await api.get("/products", { params });

      const products = data.products || data;

      const categories = [...new Set(products.map((p) => p.category))];

      set({
        allProducts: products,
        categories,
      });

    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // =========================
  // SET CATEGORY
  // =========================

  setCategory: (category) => {
    const { allProducts } = get();

    const normalized = category?.toLowerCase();

    const filtered =
      !normalized || normalized === "all"
        ? allProducts
        : allProducts.filter(
            (p) => p.category?.toLowerCase() === normalized
          );

    set({
      selectedCategory: normalized || "all",
      productsData: filtered,
    });
  },

}));

export default useDisplay;
