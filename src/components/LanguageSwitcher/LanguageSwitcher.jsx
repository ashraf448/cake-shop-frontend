
// import { useTranslation } from "react-i18next";

// export default function LanguageSwitcher() {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);

//     document.documentElement.dir =
//       lng === "ar" ? "rtl" : "ltr";

//     localStorage.setItem("lang", lng);
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={() => changeLanguage("ar")}
//         className="px-3 py-1 rounded bg-white text-black"
//       >
//         AR
//       </button>

//       <button
//         onClick={() => changeLanguage("en")}
//         className="px-3 py-1 rounded bg-yellow-400 text-black"
//       >
//         EN
//       </button>
//     </div>
//   );
// }


import useTheme, { LANGUAGES } from "../../zustand/themeSlice";

// ── Translations ──────────────────────────────────────────────────────────────
export const t = {
  en: {
    home:         "Home",
    products:     "Products",
    customOrder:  "Custom Order",
    about:        "About",
    contact:      "Contact",
    login:        "Login",
    register:     "Register",
    cart:         "Cart",
    wishlist:     "Wishlist",
    profile:      "Profile",
    myOrders:     "My Orders",
    logout:       "Logout",
    shopNow:      "Shop Now",
    learnMore:    "Learn More",
    addToCart:    "Add to Cart",
    outOfStock:   "Out of Stock",
    viewAll:      "View All →",
    featuredProducts: "⭐ Featured Products",
    handPicked:   "Hand-picked by our team just for you",
    offerOfDay:   "🔥 Offer Of The Day",
    browseCategories: "Browse Categories",
    findPerfect:  "Find the perfect cake for every occasion",
    customerOpinions: "⭐ Customer Opinions",
    searchPlaceholder: "Search for products...",
    total:        "Total",
    subtotal:     "Subtotal",
    shipping:     "Shipping",
    placeOrder:   "Place Order & Continue →",
  },
  ar: {
    home:         "الرئيسية",
    products:     "المنتجات",
    customOrder:  "طلب مخصص",
    about:        "من نحن",
    contact:      "تواصل معنا",
    login:        "تسجيل الدخول",
    register:     "إنشاء حساب",
    cart:         "السلة",
    wishlist:     "المفضلة",
    profile:      "الملف الشخصي",
    myOrders:     "طلباتي",
    logout:       "تسجيل الخروج",
    shopNow:      "تسوق الآن",
    learnMore:    "اعرف أكثر",
    addToCart:    "أضف للسلة",
    outOfStock:   "نفد المخزون",
    viewAll:      "عرض الكل ←",
    featuredProducts: "⭐ المنتجات المميزة",
    handPicked:   "منتقاة بعناية من فريقنا خصيصاً لك",
    offerOfDay:   "🔥 عرض اليوم",
    browseCategories: "تصفح الفئات",
    findPerfect:  "ابحث عن الكيكة المثالية لكل مناسبة",
    customerOpinions: "⭐ آراء العملاء",
    searchPlaceholder: "ابحث عن المنتجات...",
    total:        "الإجمالي",
    subtotal:     "المجموع الفرعي",
    shipping:     "الشحن",
    placeOrder:   "تأكيد الطلب والمتابعة ←",
  },
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const language = useTheme((s) => s.language);
  return { tr: t[language] || t.en, language };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LanguageSwitcher() {
  const { language, setLanguage } = useTheme();

  const current = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const other   = LANGUAGES.find((l) => l.id !== language);

  return (
    <button
      onClick={() => setLanguage(other.id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 hover:border-white/60 transition text-sm text-white"
      title={`Switch to ${other.label}`}
    >
      <span>{other.flag}</span>
      <span className="text-xs font-medium">{other.label}</span>
    </button>
  );
}