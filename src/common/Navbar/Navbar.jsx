// import { FaHeart, FaMoon, FaBars, FaTimes, FaSun } from "react-icons/fa";
// import { FaCartPlus } from "react-icons/fa6";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
// import useDisplay from "../../zustand/displaySlice";
// import useAuth from "../../zustand/AuthSlice";
// import useWishlist from "../../zustand/wishlistSlice";
// import useCart from "../../zustand/cartSlice";
// import UserDropMenu from "../../components/dropDowns/UserDropMenu";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   // const [dark, setDark] = useState(false);

//   const navigate = useNavigate();

//   const cart = useCart((s) => s.cart);
//   const wishlist = useWishlist((s) => s.wishlist);
//   const categories = useDisplay((s) => s.categories);
//   const getAllProducts = useDisplay((s) => s.getAllProducts);

//   const currentUser = useAuth((s) => s.currentUser);
//   const isPending = useAuth((s) => s.isPendingCurrentUser);

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   // useEffect(() => {
//   //   //document.documentElement.classList.toggle("dark", dark);
//   // }, []);

//   const linkStyle = ({ isActive }) =>
//     `px-3 py-2 rounded-lg transition ${
//       isActive
//         ? "bg-white text-black font-semibold"
//         : "text-white hover:bg-white/20"
//     }`;

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <div className="sticky top-0 z-50">
//       {/* ================= NAVBAR ================= */}
//       <div className="flex justify-between items-center px-4 md:px-10 py-3 bg-black text-white">
//         {/* LOGO */}
//         <NavLink to="/" className="font-bold text-xl md:text-3xl">
//           Amira <span className="text-yellow-400">cake designer</span>
//         </NavLink>

//         {/* DESKTOP LINKS */}
//         <ul className="hidden md:flex items-center gap-6">
//           <li>
//             <NavLink to="/" className={linkStyle}>
//               HOME
//             </NavLink>
//           </li>

//           {/* PRODUCTS */}
//           <li className="relative group">
//             <NavLink to="/products" className={linkStyle}>
//               PRODUCTS
//             </NavLink>

//             <ul className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
//               {categories?.map((cat, i) => (
//                 <li key={i}>
//                   <NavLink
//                     to={`/products?category=${cat.toLowerCase()}`}
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     {cat}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </li>
//           <li>
//             <NavLink to="/custom-order" className={linkStyle}>
//               CUSTOM ORDER
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/about" className={linkStyle}>
//               ABOUT
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/contact" className={linkStyle}>
//               CONTACT
//             </NavLink>
//           </li>
//         </ul>

//         {/* ================= ICONS ================= */}
//         <div className="hidden md:flex items-center gap-4">
//           {/* DARK MODE
//           <div>
//       <ThemeToggle />
//     </div> */}

//           {/* WISHLIST */}
//           <div
//             onClick={() => navigate("/wishlist")}
//             className="flex items-center gap-1 cursor-pointer"
//           >
//             <FaHeart className="text-red-500" />
//             <sub>({wishlist.length})</sub>
//           </div>

//           {/* CART */}
//           <div
//             onClick={() => navigate("/cart")}
//             className="flex items-center gap-1 cursor-pointer"
//           >
//             <FaCartPlus />
//             <sub>({cart.length})</sub>
//           </div>

//           {/* ================= AUTH ================= */}
//           {isPending ? (
//             <span>Loading...</span>
//           ) : currentUser ? (
//             <UserDropMenu user={currentUser} />
//           ) : (
//             <div className="flex items-center gap-2">
//               <NavLink
//                 to="/login"
//                 className="px-3 py-1 bg-white text-black rounded"
//               >
//                 Login
//               </NavLink>

//               <NavLink to="/register" className="px-3 py-1 border rounded">
//                 Register
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* MOBILE BUTTON */}
//         <div
//           className="md:hidden text-2xl cursor-pointer"
//           onClick={() => setMenuOpen(true)}
//         >
//           <FaBars />
//         </div>
//       </div>

//       {/* ================= MOBILE MENU ================= */}
//       <div
//         className={`fixed inset-0 bg-black/60 z-50 ${
//           menuOpen ? "block" : "hidden"
//         }`}
//       >
//         <div className="bg-white w-64 h-full p-5">
//           <div className="flex justify-between mb-5">
//             <h2 className="font-bold">Menu</h2>
//             <FaTimes onClick={closeMenu} />
//           </div>

//           <ul className="flex flex-col gap-4">
//             <li>
//               <NavLink onClick={closeMenu} to="/">
//                 HOME
//               </NavLink>
//             </li>

//             <li>
//               <NavLink onClick={closeMenu} to="/products">
//                 PRODUCTS
//               </NavLink>
//             </li>

//             <div className="pl-3">
//               {categories?.map((cat, i) => (
//                 <NavLink
//                   key={i}
//                   to={`/products?category=${cat.toLowerCase()}`}
//                   onClick={closeMenu}
//                   className="block text-gray-600"
//                 >
//                   {cat}
//                 </NavLink>
//               ))}
//             </div>
//             <li>
//               <NavLink onClick={closeMenu} to="/custom-order">
//                 CUSTOM ORDER
//               </NavLink>
//             </li>

//             <li>
//               <NavLink onClick={closeMenu} to="/about">
//                 ABOUT
//               </NavLink>
//             </li>

//             <li>
//               <NavLink onClick={closeMenu} to="/contact">
//                 CONTACT
//               </NavLink>
//             </li>

//             {/* AUTH MOBILE */}
//             <div className="mt-4">
//               {currentUser ? (
//                 <>
//                   <NavLink
//                     to="/profile"
//                     onClick={closeMenu}
//                     className="block mb-2"
//                   >
//                     Profile
//                   </NavLink>


//                   <NavLink
//                     to="/cart"
//                     onClick={closeMenu}
//                     className="block mb-2"
//                   >
//                     Cart
//                   </NavLink>

//                   <NavLink
//                     to="/my-orders"
//                     onClick={closeMenu}
//                     className="block mb-2"
//                   >
//                     My Orders
//                   </NavLink>
//                 </>
//               ) : (
//                 <div className="flex flex-col gap-2 mt-2">
//                   <NavLink
//                     to="/login"
//                     className="px-3 py-1 bg-black text-white rounded"
//                   >
//                     Login
//                   </NavLink>

//                   <NavLink to="/register" className="px-3 py-1 border rounded">
//                     Register
//                   </NavLink>
//                 </div>
//               )}
//             </div>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }


import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "../../components/LanguageSwitcher/LanguageSwitcher";
import useDisplay from "../../zustand/displaySlice";
import useAuth from "../../zustand/AuthSlice";
import useWishlist from "../../zustand/wishlistSlice";
import useCart from "../../zustand/cartSlice";
import UserDropMenu from "../../components/dropDowns/UserDropMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate     = useNavigate();
  const { tr }       = useTranslation();

  const cart         = useCart((s) => s.cart);
  const wishlist     = useWishlist((s) => s.wishlist);
  const categories   = useDisplay((s) => s.categories);
  const getAllProducts= useDisplay((s) => s.getAllProducts);
  const currentUser  = useAuth((s) => s.currentUser);
  const isPending    = useAuth((s) => s.isPendingCurrentUser);

  useEffect(() => { getAllProducts(); }, []);

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition ${
      isActive ? "bg-white text-black font-semibold" : "text-white hover:bg-white/20"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-10 py-3 bg-black text-white">
        {/* LOGO */}
        <NavLink to="/" className="font-bold text-xl md:text-3xl">
          Amira <span className="text-yellow-400">cake designer</span>
        </NavLink>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-6">
          <li><NavLink to="/" className={linkStyle}>{tr.home}</NavLink></li>

          <li className="relative group">
            <NavLink to="/products" className={linkStyle}>{tr.products}</NavLink>
            <ul className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              {categories?.map((cat, i) => (
                <li key={i}>
                  <NavLink to={`/products?category=${cat.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100">{cat}</NavLink>
                </li>
              ))}
            </ul>
          </li>

          <li><NavLink to="/custom-order" className={linkStyle}>{tr.customOrder}</NavLink></li>
          <li><NavLink to="/about"        className={linkStyle}>{tr.about}</NavLink></li>
          <li><NavLink to="/contact"      className={linkStyle}>{tr.contact}</NavLink></li>
        </ul>

        {/* DESKTOP ICONS */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language */}
          {/* <LanguageSwitcher />

          {/* Theme */}
          {/* <ThemeToggle />  */}

          {/* Wishlist */}
          <div onClick={() => navigate("/wishlist")} className="flex items-center gap-1 cursor-pointer">
            <FaHeart className="text-red-500" />
            <sub>({wishlist.length})</sub>
          </div>

          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="flex items-center gap-1 cursor-pointer">
            <FaCartPlus />
            <sub>({cart.length})</sub>
          </div>

          {/* Auth */}
          {isPending ? (
            <span>...</span>
          ) : currentUser ? (
            <UserDropMenu user={currentUser} />
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login"    className="px-3 py-1 bg-white text-black rounded">{tr.login}</NavLink>
              <NavLink to="/register" className="px-3 py-1 border rounded">{tr.register}</NavLink>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-black/60 z-50 ${menuOpen ? "block" : "hidden"}`}>
        <div className="bg-white w-64 h-full p-5 overflow-y-auto">
          <div className="flex justify-between mb-5">
            <h2 className="font-bold">Menu</h2>
            <FaTimes onClick={closeMenu} className="cursor-pointer" />
          </div>

          {/* Mobile theme + lang */}
          <div className="flex gap-2 mb-4">
            {/* <LanguageSwitcher /> */}
            {/* <ThemeToggle /> */}
          </div>

          <ul className="flex flex-col gap-4">
            <li><NavLink onClick={closeMenu} to="/">{tr.home}</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/products">{tr.products}</NavLink></li>
            <div className="pl-3">
              {categories?.map((cat, i) => (
                <NavLink key={i} to={`/products?category=${cat.toLowerCase()}`}
                  onClick={closeMenu} className="block text-gray-600">{cat}</NavLink>
              ))}
            </div>
            <li><NavLink onClick={closeMenu} to="/custom-order">{tr.customOrder}</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/about">{tr.about}</NavLink></li>
            <li><NavLink onClick={closeMenu} to="/contact">{tr.contact}</NavLink></li>

            <div className="mt-4">
              {currentUser ? (
                <>
                  <NavLink to="/profile"   onClick={closeMenu} className="block mb-2">{tr.profile}</NavLink>
                  <NavLink to="/my-orders" onClick={closeMenu} className="block mb-2">{tr.myOrders}</NavLink>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <NavLink to="/login"    className="px-3 py-1 bg-black text-white rounded">{tr.login}</NavLink>
                  <NavLink to="/register" className="px-3 py-1 border rounded">{tr.register}</NavLink>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}