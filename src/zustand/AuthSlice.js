

import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// axios instance بتاعت الفرونت
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ضيف التوكن تلقائياً في كل request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// لو 401 امسح التوكن وودّي المستخدم للـ login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export { api };

const useAuth = create((set, get) => ({

  // =========================
  // STATES
  // =========================

  currentUser: null,
  isPendingRegister: false,
  isPendingLogin: false,
  isPendingCurrentUser: true,

  // =========================
  // REGISTER
  // =========================

  registerHandler: async (data) => {
    set({ isPendingRegister: true });

    try {
      const { firstName, lastName, phone, gender, email, password } = data;

      const res = await api.post("/auth/register", {
        userName: `${firstName.trim()} ${lastName.trim()}`,
        email,
        password,
        phone,
        gender,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({ currentUser: user });

      toast.success("Account Created Successfully ✅");
      return { success: true };

    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return { success: false, message: msg };

    } finally {
      set({ isPendingRegister: false });
    }
  },

  // =========================
  // LOGIN
  // =========================

  loginHandler: async (data) => {
    set({ isPendingLogin: true });

    try {
      const { email, password } = data;

      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({ currentUser: user });

      toast.success("Login Success ✅");
      return { success: true };

    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return { success: false, message: msg };

    } finally {
      set({ isPendingLogin: false });
    }
  },

  // =========================
  // LOGOUT
  // =========================

  logoutHandler: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("paymentSuccess");
    set({ currentUser: null });
    toast.success("Logged Out");
  },

  // =========================
  // INITIAL AUTH (استخدمها بدل initiaAuth)
  // =========================

  initiaAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ isPendingCurrentUser: false });
      return;
    }

    try {
      const res = await api.get("/auth/me");
      set({ currentUser: res.data.user });
    } catch {
      localStorage.removeItem("token");
      set({ currentUser: null });
    } finally {
      set({ isPendingCurrentUser: false });
    }
  },

}));

export default useAuth;
