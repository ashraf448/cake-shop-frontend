import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../../zustand/AuthSlice";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", message:"", rating:5 });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",    form.name);
      fd.append("email",   form.email);
      fd.append("message", form.message);
      fd.append("rating",  form.rating);
      if (imageFile) fd.append("image", imageFile);

      await api.post("/reviews", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      toast.success("Review submitted! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Contact">
      {/* Hero */}
      <div className="h-[35vh] md:h-[50vh] bg-[url('/images/contact.jpg')] bg-cover bg-center flex items-center justify-center text-white px-4">
        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
          className="bg-black/60 p-6 md:p-8 rounded-2xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold">Share Your Experience ⭐</h1>
          <p className="mt-2 text-sm md:text-base">We'd love to hear from you 💌</p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-10 py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        {/* Form */}
        {submitted ? (
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            className="flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-500">Your review has been submitted and will appear after approval.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", message:"", rating:5 }); setImageFile(null); setPreview(""); }}
              className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition">
              Submit Another Review
            </button>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:gap-5 bg-white p-5 md:p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold">Leave a Review</h2>

            {/* Rating stars */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button"
                    onClick={() => setForm(p => ({ ...p, rating: star }))}
                    className={`text-2xl transition ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>

            <input type="text" placeholder="Your Name *"
              className="p-3 border rounded-xl outline-none focus:border-pink-400"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />

            <input type="email" placeholder="Your Email *"
              className="p-3 border rounded-xl outline-none focus:border-pink-400"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />

            <textarea placeholder="Share your experience... *" rows={4}
              className="p-3 border rounded-xl outline-none focus:border-pink-400 resize-none"
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Photo (optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-pink-400 transition"
                onClick={() => document.getElementById("reviewImg").click()}>
                {preview
                  ? <img src={preview} alt="preview" className="max-h-32 mx-auto rounded-xl object-contain" />
                  : <div><div className="text-3xl mb-1">📷</div><p className="text-gray-400 text-sm">Upload a photo</p></div>
                }
              </div>
              <input id="reviewImg" type="file" accept="image/*" className="hidden" onChange={handleImage} />
              {preview && (
                <button type="button" onClick={() => { setImageFile(null); setPreview(""); }}
                  className="text-xs text-red-400 mt-1 underline">Remove</button>
              )}
            </div>

            <motion.button whileHover={{ scale:1.02 }} type="submit" disabled={loading}
              className="bg-pink-500 text-white py-3 rounded-xl disabled:opacity-60 font-semibold">
              {loading ? "Submitting..." : "Submit Review ⭐"}
            </motion.button>
          </motion.form>
        )}

        {/* Info */}
        <div className="flex flex-col gap-4 md:gap-6 justify-center text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Have a question? Want to order a custom cake? Contact us anytime 💬
          </p>
          <div className="space-y-3 text-gray-700 text-sm md:text-base">
            <p>📍 Location: Cairo, Egypt</p>
            <p>📞 Phone: 01000000000</p>
            <p>📧 Email: info@cake.com</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 md:px-10 pb-10 md:pb-20">
        <iframe title="map"
          src="https://maps.google.com/maps?q=cairo&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-64 md:h-96 rounded-3xl border-0" loading="lazy" />
      </div>
    </div>
  );
}
