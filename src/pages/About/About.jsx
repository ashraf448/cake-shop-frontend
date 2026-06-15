import logo from "../../assets/images/logo.jpg";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="About overflow-hidden">
      {/* Hero Section */}
      <div className="h-[70vh] bg-[url('/images/about.jpg')] bg-cover bg-center flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 p-10 rounded-2xl text-center"
        >
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg">Crafting sweet memories 🎂</p>
        </motion.div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          src={logo}
          alt="About Logo"
          className="rounded-3xl shadow-2xl"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        />

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-bold text-(--Text-color)">Who We Are</h2>
          <p className="text-gray-600 text-xl leading-relaxed">
            At Amira Cakes, every cake tells a story. We specialize in creating custom cakes and desserts that reflect our passion for creativity, craftsmanship, and unforgettable flavors. Our goal is to make every celebration extra special.
          </p>

          {/* <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-gray-500 text-sm">
                Delivering genuine happiness through every cake.{" "}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="text-gray-500 text-sm">
                We are the best in the world of luxury cakes.{" "}
              </p>
            </div>
          </div> */}
        </motion.div>
      </div>

      {/* Features Section */}
      {/* <div className="bg-gray-100 py-20 px-10">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {["Fresh Ingredients", "Custom Designs", "Fast Delivery"].map(
            (item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-white rounded-3xl shadow-lg"
              >
                <h4 className="text-xl font-bold mb-3">{item}</h4>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div> */}

      {/* Social Media Section */}
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Follow Us
        </motion.h2>

        <div className="flex justify-center gap-6 text-2xl">
          <motion.a
            href="https://www.facebook.com/share/17hswT8amU/"
            target="_blank"
            rel="noreferrer"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
          >
            <FaFacebookF />
          </motion.a>

          <motion.a
            href="https://www.instagram.com/amir.amohamed46?igsh=eXZveXo3dzhuM21y"
            target="_blank"
            rel="noreferrer"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.2, rotate: -5 }}
            className="bg-pink-500 text-white p-4 rounded-full shadow-lg"
          >
            <FaInstagram />
          </motion.a>

          <motion.a
            href="https://www.tiktok.com/@amiramohamed9270"
            target="_blank"
            rel="noreferrer"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.2 }}
            className= "bg-gray-800 text-white p-4 rounded-full shadow-lg"
          >
              <FaTiktok />
          </motion.a>
        </div>
      </motion.div>
      {/* Order Notice Section */}
<motion.div
  className="py-16 px-6 sm:px-10 bg-pink-50 text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  <h2 className="text-3xl sm:text-4xl font-bold text-(--Text-color) mb-8">
    Important Notice 🤍
  </h2>

  <div className="max-w-3xl mx-auto grid gap-6">
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100"
    >
      <p className="text-lg sm:text-xl text-gray-700 font-medium">
        • Please place your order one week before the occasion 🎂
      </p>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100"
    >
      <p className="text-lg sm:text-xl text-gray-700 font-medium">
        • Wedding Cakes should be ordered two weeks in advance 🤍
      </p>
    </motion.div>
  </div>
</motion.div>
      {/* CTA Section */}
      <motion.div
  className="text-center py-20 px-4 sm:px-10 bg-(--Text-color) text-white"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  <motion.h2
    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    Ready for your special cake?
  </motion.h2>

  <motion.a
    href="/products"
    whileHover={{ scale: 1.05 }}
    className="bg-white text-(--Text-color) px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg md:text-xl font-semibold shadow-lg inline-block"
  >
    Shop Now
  </motion.a>
</motion.div>
    </div>
  );
}
