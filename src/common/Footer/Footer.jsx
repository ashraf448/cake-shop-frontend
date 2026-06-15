

import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../zustand/AuthSlice";

export default function Footer() {
  const currentUser = useAuth((s) => s.currentUser);
  const isAdmin     = currentUser?.role === "admin";

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-10">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <p className="text-3xl font-bold mb-4">CakeShop 🍰</p>
          <p className="text-gray-400 mb-2.5">
            Delicious cakes crafted with love for every special moment ❤️
          </p>
          {/* Admin dashboard link */}
          {isAdmin && (
            <Link to="/admin">⚡ Admin Dashboard</Link>
          )}
        </div>

        <div>
          <p className="text-xl mb-4 font-semibold">Links</p>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer"><Link to="/">Home</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to="/products">Products</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to="/custom-order">Custom Order</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to="/about">About</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xl mb-4 font-semibold">Newsletter</p>
          <p className="text-gray-400 mb-3">Subscribe to get latest offers 🎁</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 rounded-l-lg outline-none border border-pink-500 text-white bg-gray-800"
            />
            <button className="bg-pink-500 px-4 rounded-r-lg hover:bg-pink-600 transition">
              Send
            </button>
          </div>
        </div>

        <div>
          <p className="text-xl mb-4 font-semibold">Follow Us</p>
          <div className="flex justify-center gap-4 text-xl">
            <motion.a href="https://www.facebook.com/share/17hswT8amU/" target="_blank" rel="noreferrer"
              initial={{ y:50, opacity:0 }} whileInView={{ y:0, opacity:1 }} transition={{ delay:0.3 }}
              whileHover={{ scale:1.2, rotate:5 }}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
              <FaFacebookF />
            </motion.a>
            <motion.a href="https://www.instagram.com/amir.amohamed46?igsh=eXZveXo3dzhuM21y" target="_blank" rel="noreferrer"
              initial={{ y:50, opacity:0 }} whileInView={{ y:0, opacity:1 }} transition={{ delay:0.3 }}
              whileHover={{ scale:1.2, rotate:-5 }}
              className="bg-pink-500 text-white p-4 rounded-full shadow-lg">
              <FaInstagram />
            </motion.a>
            <motion.a href="https://www.tiktok.com/@amiramohamed9270" target="_blank" rel="noreferrer"
              initial={{ y:50, opacity:0 }} whileInView={{ y:0, opacity:1 }} transition={{ delay:0.3 }}
              whileHover={{ scale:1.2 }}
              className="bg-gray-800 text-white p-4 rounded-full shadow-lg">
              <FaTiktok />
            </motion.a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} CakeShop. Made with ❤️
      </div>
    </footer>
  );
}
