
import { create } from "zustand";
import { api } from "./AuthSlice";
import toast from "react-hot-toast";

const useWishlist = create((set, get) => ({

  wishlist: [],

  // =========================
  // FETCH WISHLIST
  // =========================

  fetchWishlist: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ wishlist: [] });
      return;
    }

    try {
      // الباك: GET /api/wishlist (بيرجع المنتجات كاملة)
      const { data } = await api.get("/wishlist");
      set({ wishlist: data.wishlist || data });
    } catch (error) {
      console.log(error);
    }
  },

  // =========================
  // ADD / REMOVE (toggle)
  // =========================

  likeOrDislike: async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must login first 🔐");
      return;
    }

    try {
      // الباك: POST /api/wishlist/:productId/toggle
      const { data } = await api.post(`/wishlist/${product.id}/toggle`);

      if (data.action === "added") {
        set({ wishlist: [...get().wishlist, product] });
        toast.success("Added to wishlist ❤️");
      } else {
        set({
          wishlist: get().wishlist.filter((item) => item.id !== product.id),
        });
        toast.success("Removed from wishlist 💔");
      }

    } catch (error) {
      console.log(error);
      toast.error("Wishlist error");
    }
  },

  // =========================
  // CHECK
  // =========================

  isInWishlist: (id) => {
    return get().wishlist.some((item) => item.id === id);
  },

  // =========================
  // CLEAR
  // =========================

  clearWishlist: () => {
    set({ wishlist: [] });
  },

}));

export default useWishlist;
