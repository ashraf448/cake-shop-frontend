

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../zustand/AuthSlice";
import useCart from "../../zustand/cartSlice";

export default function UploadPaymentProof() {
  const navigate   = useNavigate();
  const { clearCart } = useCart();

  const orderId    = localStorage.getItem("pendingOrderId");
  const orderTotal = localStorage.getItem("pendingOrderTotal");

  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  if (!orderId) {
    navigate("/checkout");
    return null;
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please upload payment proof");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("paymentProof", image);

      await api.patch(`/orders/${orderId}/payment-proof`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // cleanup
      clearCart();
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("pendingOrderTotal");
      localStorage.removeItem("paymentMethod");
      localStorage.setItem("paymentSuccess", "true");

      toast.success("Payment proof uploaded ✅");
      navigate("/order-success");

    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Upload Payment Proof</h1>

      <div className="border p-6 rounded-2xl space-y-6 bg-white shadow">

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Order</p>
          <p className="font-bold">#{orderId.slice(-6).toUpperCase()} · EGP {Number(orderTotal).toLocaleString()}</p>
        </div>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 transition"
          onClick={() => document.getElementById("proofInput").click()}
        >
          {preview ? (
            <img src={preview} alt="proof" className="max-h-64 mx-auto rounded-xl object-contain" />
          ) : (
            <div>
              <div className="text-5xl mb-3">📤</div>
              <p className="text-gray-500">Click to upload screenshot</p>
              <p className="text-xs text-gray-400 mt-1">JPEG / PNG · max 5MB</p>
            </div>
          )}
        </div>

        <input
          id="proofInput" type="file" accept="image/*"
          className="hidden" onChange={handleImage}
        />

        {preview && (
          <button
            onClick={() => { setImage(null); setPreview(""); }}
            className="text-sm text-red-500 underline"
          >
            Remove image
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !image}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl w-full text-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Confirm Payment ✅"}
        </button>

      </div>
    </section>
  );
}
