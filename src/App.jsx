

import { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import useTheme from "./zustand/themeSlice";
import useAuth from "./zustand/AuthSlice";
import useWishlist from "./zustand/wishlistSlice";

//import banner1 from "./assets/images/1.jpeg";
 
// ── Frontend layouts & pages ───────────────────────────────────────────────────
const Layout               = lazy(() => import("./layout/Layout"));
const Home                 = lazy(() => import("./pages/Home/Home"));
const Products             = lazy(() => import("./pages/Products/Products"));
const ProductDetails       = lazy(() => import("./common/dynamic/ProductDetails"));
const About                = lazy(() => import("./pages/About/About"));
const Contact              = lazy(() => import("./pages/Contact/Contact"));
const Register             = lazy(() => import("./pages/Auth/Register"));
const Login                = lazy(() => import("./pages/Auth/Login"));
const Cart                 = lazy(() => import("./pages/Auth/cart"));
const Wishlist             = lazy(() => import("./pages/Auth/wishList"));
const Profile              = lazy(() => import("./pages/Profile/Profile"));
const Checkout             = lazy(() => import("./pages/Checkout/Checkout"));
const Payment              = lazy(() => import("./pages/Checkout/Payment"));
const UploadPaymentProof   = lazy(() => import("./pages/Checkout/UploadPaymentProof"));
const OrderSuccess         = lazy(() => import("./pages/Checkout/OrderSuccess"));
const CustomOrder          = lazy(() => import("./pages/CustomOrder/CustomOrder"));
const CustomOrderStatus    = lazy(() => import("./pages/CustomOrder/CustomOrderStatus"));
const MyCustomOrders       = lazy(() => import("./pages/CustomOrder/MyCustomOrders"));
const TrackOrder           = lazy(() => import("./pages/TrackOrder/TrackOrder"));
const MyOrders             = lazy(() => import("./pages/orders/MyOrders"));
const OrderDetails         = lazy(() => import("./pages/orders/OrderDetails"));
const ProtectedCheckout    = lazy(() => import("./components/protected/ProtectedCheckout"));
const ProtectedPayment     = lazy(() => import("./components/protected/ProtectedPayment"));
const ServiceDetails       = lazy(() => import("./components/Servcies/ServiceDetails"));
 
// ── Dashboard pages ────────────────────────────────────────────────────────────
const AdminLayout       = lazy(() => import("./dashboard/components/Layout"));
const AdminDashboard    = lazy(() => import("./dashboard/pages/Dashboard"));
const AdminAnalytics    = lazy(() => import("./dashboard/pages/Analytics"));
const AdminOrders       = lazy(() => import("./dashboard/pages/Orders"));
const AdminOrderTrack   = lazy(() => import("./dashboard/pages/OrderTracking"));
const AdminEditOrder   = lazy(() => import("./dashboard/pages/EditOrder"));
const AdminProducts     = lazy(() => import("./dashboard/pages/Products"));
const AdminStock        = lazy(() => import("./dashboard/pages/Stock"));
const AdminUsers        = lazy(() => import("./dashboard/pages/Users"));
const AdminRBAC         = lazy(() => import("./dashboard/pages/RBAC"));
const AdminCustomOrders = lazy(() => import("./dashboard/pages/CustomOrders"));
const AdminReviews      = lazy(() => import("./dashboard/pages/DashboardReviews"));
const AdminNotifications= lazy(() => import("./dashboard/pages/Notifications"));
const AdminHero         = lazy(() => import("./dashboard/pages/HeroSettings"));
const AdminOfferSettings= lazy(() => import("./dashboard/pages/OfferSettings"));

// ── Premium Loader ─────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-black text-white">
    Loading...
  </div>
);

const Loader = () => {
  return (
    <div
      className="fixed inset-0 z-9999 overflow-hidden flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at top, rgba(255,215,170,0.15), transparent 30%),
          linear-gradient(to bottom right, #1a1a1a, #0f172a, #111827)
        `,
      }}
    >
      {/* Background glow */}
      <div className="absolute w-72 h-72 bg-pink-400/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-amber-300/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Main Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-4xl px-10 py-14 shadow-2xl text-center max-w-lg mx-4 animate-fade-up">

        {/* Cake */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute w-32 h-32 bg-amber-300/20 rounded-full blur-2xl animate-pulse"></div>

          <div className="text-[90px] animate-float drop-shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
            🎂
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          Amira
        </h1>

        <h2 className="text-amber-300 text-2xl md:text-3xl font-semibold mt-2">
          Cake Designer
        </h2>

        {/* Description */}
        <p className="text-gray-200 mt-5 text-lg leading-relaxed">
          Luxury handcrafted cakes made with elegance & love
        </p>

        {/* Progress */}
        <div className="mt-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-amber-200 via-pink-300 to-amber-400 animate-loading rounded-full"></div>
        </div>

        {/* Loading text */}
        <p className="text-amber-100 text-sm tracking-[4px] uppercase mt-5 animate-pulse">
          Loading Experience
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-up {
          animation: fade-up 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-loading {
          animation: loading 4s linear forwards;
        }
      `}</style>
    </div>
  );
};

// ── Admin Loader ───────────────────────────────────────────────────────────────
const AdminLoader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f0f1a",
      color: "#fff",
      fontSize: 18,
    }}
  >
    Loading Dashboard...
  </div>
);

// ── Admin route guard ──────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const currentUser = useAuth((s) => s.currentUser);
  const isPending = useAuth((s) => s.isPendingCurrentUser);

  if (isPending) return <AdminLoader />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const initiaAuth = useAuth((s) => s.initiaAuth);
  const fetchWishlist = useWishlist((s) => s.fetchWishlist);
  const { theme } = useTheme();

  const [showLoader, setShowLoader] = useState(true);

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Auth
  useEffect(() => {
    const record = initiaAuth();
    fetchWishlist();

    return () => record?.();
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
useEffect(() => {
  useTheme.getState().initTheme(); // ← أضف
  const record = initiaAuth();
  fetchWishlist();
  return () => record?.();
}, []);
  // Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<PageLoader />}>
          <Layout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          ),
        },

        {
          path: "products",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          ),
        },

        {
          path: "products/:category",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          ),
        },

        {
          path: "product/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ProductDetails />
            </Suspense>
          ),
        },

        {
          path: "about",
          element: (
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          ),
        },

        {
          path: "contact",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          ),
        },

        {
           path: "services/:type",

         element: (
           <Suspense fallback={<PageLoader />}>
             <ServiceDetails />
           </Suspense>
         ),
       },

        {
          path: "register",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Register />
            </Suspense>
          ),
        },

        {
          path: "login",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          ),
        },

            {
           path: "wishlist",

           element: (
             <Suspense fallback={<PageLoader />}>
               <Wishlist />
             </Suspense>
           ),
         },

         {
           path: "cart",

            element: (
             <Suspense fallback={<PageLoader />}>
               <Cart />
             </Suspense>
           ),
         },

         {
           path: "profile",

           element: (
             <Suspense fallback={<PageLoader />}>
               <Profile />
             </Suspense>
           ),
         },

//         // ================= CHECKOUT =================
         {
           path: "checkout",

           element: (
             <ProtectedCheckout>
               <Suspense fallback={<PageLoader />}>
                 <Checkout />
               </Suspense>
             </ProtectedCheckout>
           ),
         },

//         // ================= PAYMENT =================
         {
           path: "payment",

           element: (
             <ProtectedCheckout>
               <Suspense fallback={<PageLoader />}>
                 <Payment />
               </Suspense>
             </ProtectedCheckout>
           ),
         },

//         // ================= UPLOAD PAYMENT =================
         {
           path: "upload-payment",

           element: (
             <ProtectedCheckout>
               <Suspense fallback={<PageLoader />}>
                 <UploadPaymentProof />
               </Suspense>
             </ProtectedCheckout>
           ),
         },

//         // ================= ORDER SUCCESS =================
         {
           path: "order-success",

           element: (
             <ProtectedPayment>
               <Suspense fallback={<PageLoader />}>
                 <OrderSuccess />
               </Suspense>
             </ProtectedPayment>
           ),
         },

//         // ================= TRACK ORDER =================
         {
           path: "track-order/:id",

           element: (
             <Suspense fallback={<PageLoader />}>
               <TrackOrder />
             </Suspense>
           ),
         },

//         // ================= MY ORDERS =================
         {
           path: "my-orders",

           element: (
             <Suspense fallback={<PageLoader />}>
               <MyOrders />
             </Suspense>
           ),
         },

//         // ================= ORDER DETAILS =================
         {
           path: "orders/:id",

           element: (
             <Suspense fallback={<PageLoader />}>
               <OrderDetails />
             </Suspense>
           ),
         },

//         // ================= CUSTOM ORDERS =================
         {
           path: "custom-order",

           element: (
             <Suspense fallback={<PageLoader />}>
               <CustomOrder />
             </Suspense>
           ),
         },

         {
           path: "custom-orders/:id",

           element: (
             <Suspense fallback={<PageLoader />}>
               <CustomOrderStatus />
             </Suspense>
           ),
         },

         {
           path: "my-custom-orders",

           element: (
             <Suspense fallback={<PageLoader />}>
               <MyCustomOrders />
             </Suspense>
           ),
         },

//         // ================= 404 =================
         {
           path: "*",

           element: <Navigate to="/" />,
         },

         
        ],
      },
      {
  path: "/admin",
  element: (
    <AdminRoute>
      <Suspense fallback={<AdminLoader />}>
        <AdminLayout />
      </Suspense>
    </AdminRoute>
  ),
  children: [
    { index: true,                   element: <Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense> },
    { path: "analytics",             element: <Suspense fallback={<AdminLoader />}><AdminAnalytics /></Suspense> },
    { path: "orders",                element: <Suspense fallback={<AdminLoader />}><AdminOrders /></Suspense> },
    { path: "orders/:id/edit",       element: <Suspense fallback={<AdminLoader />}><AdminEditOrder  /></Suspense> },
    { path: "products",              element: <Suspense fallback={<AdminLoader />}><AdminProducts /></Suspense> },
    { path: "stock",                 element: <Suspense fallback={<AdminLoader />}><AdminStock /></Suspense> },
    { path: "users",                 element: <Suspense fallback={<AdminLoader />}><AdminUsers /></Suspense> },
    { path: "rbac",                  element: <Suspense fallback={<AdminLoader />}><AdminRBAC /></Suspense> },
    { path: "custom-orders",         element: <Suspense fallback={<AdminLoader />}><AdminCustomOrders /></Suspense> },
    { path: "reviews",               element: <Suspense fallback={<AdminLoader />}><AdminReviews /></Suspense> },
    { path: "notifications",         element: <Suspense fallback={<AdminLoader />}><AdminNotifications /></Suspense> },
    { path: "hero",                  element: <Suspense fallback={<AdminLoader />}><AdminHero /></Suspense> },
    { path: "offer-settings",        element: <Suspense fallback={<AdminLoader />}><AdminOfferSettings /></Suspense> },
    { path: "*",                     element: <Navigate to="/admin" replace /> },
  ],
},
  ]);

  // Show intro loader
  if (showLoader) {
    return <Loader />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000 }}
      />

      <RouterProvider router={router} />
    </>
  );
}
