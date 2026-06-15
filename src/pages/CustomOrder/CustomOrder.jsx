import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../../zustand/AuthSlice";

const SIZES    = ["14 cm", "16 cm", "18 cm", "20 cm", "22 cm", "24 cm", "26 cm", "28 cm", "30 cm"];
const FLAVORS  = ["Vanilla", "Chocolate", "Red Velvet", "Caramel", "Lemon", "Strawberry", "Other"];

export default function CustomOrder() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    size:        "",
    flavor:      "",
    layers:      1,
    deliveryDate:"",
    phone:       "",
    address:     "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Max 5MB");      return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      const { data } = await api.post("/custom-orders", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Order submitted! We'll contact you with a price soon 🎂");
      navigate(`/custom-orders/${data.order._id}`);

    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">

      {/* Hero */}
      <div className="h-[30vh] bg-linear-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-center px-4">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
          <h1 className="text-4xl font-bold mb-2">🎂 Custom Cake Order</h1>
          <p className="text-pink-100">Tell us your dream cake and we'll make it happen!</p>
        </motion.div>
      </div>
<div className="flex justify-center mt-4">
  <button
    type="button"
    onClick={() => navigate("/my-custom-orders")}
    className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-pink-50 transition"
  >
    📦 View My Custom Orders
  </button>
</div>
      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Cake Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe your dream cake in detail... (theme, colors, decorations, inscription, etc.)"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400 resize-none"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Size + Flavor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Cake Size</label>
              <select name="size" className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                value={form.size} onChange={handleChange}>
                <option value="">Select size</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Flavor</label>
              <select name="flavor" className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                value={form.flavor} onChange={handleChange}>
                <option value="">Select flavor</option>
                {FLAVORS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Layers + Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Number of Layers</label>
              <select name="layers" className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                value={form.layers} onChange={handleChange}>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} layer{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Date</label>
              <input type="date" name="deliveryDate"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                min={new Date().toISOString().split("T")[0]}
                value={form.deliveryDate} onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone + Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input type="text" name="phone" placeholder="01xxxxxxxxx"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                value={form.phone} onChange={handleChange} required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input type="text" name="address" placeholder="City, Street..."
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-pink-400"
                value={form.address} onChange={handleChange} required
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Reference Image <span className="text-gray-400">(optional)</span>
            </label>
            <div
              className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center cursor-pointer hover:border-pink-400 transition"
              onClick={() => document.getElementById("cakeImage").click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-xl object-contain" />
              ) : (
                <div>
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-400 text-sm">Upload a reference photo of your dream cake</p>
                </div>
              )}
            </div>
            <input id="cakeImage" type="file" accept="image/*" className="hidden" onChange={handleImage} />
            {preview && (
              <button type="button" onClick={() => { setImageFile(null); setPreview(""); }}
                className="text-xs text-red-400 mt-2 underline">
                Remove image
              </button>
            )}
          </div>

          {/* Info note */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm text-pink-700">
            🎀 After submitting, our team will review your order and send you a price quote.
            You'll be able to accept the quote and complete payment from your orders page.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-60 transition"
          >
            {loading ? "Submitting..." : "🎂 Submit Custom Order"}
          </button>

        </form>
      </div>
    </div>
  );
}
