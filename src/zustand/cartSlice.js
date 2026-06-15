

import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuth from "./AuthSlice";
import toast from "react-hot-toast";

// helper: الباك بيرجع _id، الفرونت كان بيستخدم id
const getId = (item) => item._id || item.id;

const useCart = create(
  persist(
    (set, get) => ({

      cart: [],

      // ── ADD TO CART ──────────────────────────────────────────────────────────
      addToCart: (product, qty = 1) => {
        const { currentUser } = useAuth.getState();
        if (!currentUser) {
          toast.error("You must log in first 🔐");
          return;
        }

        const pid = getId(product);

        set((state) => {
          const exist = state.cart.find((item) => getId(item) === pid);

          if (exist) {
            toast.success("تم تحديث الكمية 🛒");
            return {
              cart: state.cart.map((item) =>
                getId(item) === pid
                  ? { ...item, qty: item.qty + qty }
                  : item
              ),
            };
          }

          toast.success("تمت الإضافة للسلة ✅");
          return {
            cart: [...state.cart, { ...product, _id: pid, qty }],
          };
        });
      },

      // ── INCREASE ─────────────────────────────────────────────────────────────
      increaseQty: (id) => {
        set({
          cart: get().cart.map((item) => {
            if (getId(item) === id && item.qty >= item.stock) {
              toast.error("الكمية غير متوفرة ❌");
              return item;
            }
            return getId(item) === id
              ? { ...item, qty: item.qty + 1 }
              : item;
          }),
        });
      },

      // ── DECREASE ─────────────────────────────────────────────────────────────
      decreaseQty: (id) => {
        set({
          cart: get()
            .cart.map((item) =>
              getId(item) === id ? { ...item, qty: item.qty - 1 } : item
            )
            .filter((item) => item.qty > 0),
        });
      },

      // ── REMOVE ───────────────────────────────────────────────────────────────
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => getId(item) !== id) });
        toast.success("تم حذف المنتج 🗑️");
      },

      // ── CLEAR ────────────────────────────────────────────────────────────────
      clearCart: () => {
        set({ cart: [] });
        toast.success("تم تفريغ السلة 🧹");
      },

      // ── TOTAL PRICE ───────────────────────────────────────────────────────────
      getTotalPrice: () =>
        get().cart.reduce((sum, item) => {
          const price = item.finalPrice
            ? item.finalPrice
            : item.price - (item.price * (item.discount || 0)) / 100;
          return sum + price * (item.qty || 1);
        }, 0),

      // ── TOTAL ITEMS ───────────────────────────────────────────────────────────
      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.qty, 0),

      // ── BUILD ORDER ITEMS (للباك) ─────────────────────────────────────────────
      getOrderItems: () =>
        get().cart.map((item) => ({
          product:  getId(item),
          title:    item.title,
          image:    item.image,
          price:    item.price ?? item.finalPrice,
          discount: item.discount || 0,
          qty:      item.qty,
        })),
    }),
    { name: "cart-storage" }
  )
);

export default useCart;
