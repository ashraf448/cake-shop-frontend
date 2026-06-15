

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useCart from "../../zustand/cartSlice";
import { api } from "../../zustand/AuthSlice";

// ─── Terms Modal ───────────────────────────────────────────────────────────────
function TermsModal({ onAccept, onReject, expectedDate, deliveryDays, isSpecial }) {
  const [checked, setChecked] = useState(false);

  const dayLabel = isSpecial ? "2 days" : "1 week";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity:0, scale:0.9, y:20 }}
        animate={{ opacity:1, scale:1, y:0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎂</div>
          <h2 className="text-2xl font-bold">Order Terms & Conditions</h2>
          <p className="text-gray-400 text-sm mt-1">Please read before placing your order</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎂</span>
            <div>
              <p className="font-semibold text-sm">Regular Cake Orders</p>
              <p className="text-gray-600 text-sm mt-1">
                Please place your order <strong>at least one week</strong> before the occasion.
              </p>
            </div>
          </div>
          <div className="h-px bg-amber-200" />
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-semibold text-sm">Special / Other Category Cakes</p>
              <p className="text-gray-600 text-sm mt-1">
                Can be ready within <strong>2 days</strong> from order date.
              </p>
            </div>
          </div>
          <div className="h-px bg-amber-200" />
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤍</span>
            <div>
              <p className="font-semibold text-sm">Wedding Cakes</p>
              <p className="text-gray-600 text-sm mt-1">
                Require <strong>at least two weeks</strong> advance notice.
              </p>
            </div>
          </div>
        </div>

        {/* Expected delivery */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">📅 Expected Delivery Date</p>
          <p className="text-xl font-bold text-green-700">
            {expectedDate.toLocaleDateString("en-EG", {
              weekday:"long", day:"numeric", month:"long", year:"numeric"
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isSpecial
              ? "Special category: ready in ~2 days"
              : deliveryDays === 14
              ? "Wedding cake: 2 weeks preparation time"
              : "Standard cake: 1 week preparation time"}
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-pink-500"
            checked={checked} onChange={e => setChecked(e.target.checked)} />
          <span className="text-sm text-gray-600">
            I understand and agree to the order terms. I confirm that my order is placed
            at least <strong>{dayLabel}</strong> before the occasion.
          </span>
        </label>

        <div className="flex gap-3">
          <button onClick={onReject}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
            Cancel
          </button>
          <button onClick={() => checked && onAccept(expectedDate)} disabled={!checked}
            className="flex-1 bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            ✅ I Agree & Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getOrderItems, getTotalPrice } = useCart();

  const [loading,   setLoading]   = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData,  setFormData]  = useState({
    name:"", phone:"", address:"", paymentMethod:"",
  });

  const handleChange  = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const validatePhone = (p) => /^01[0125][0-9]{8}$/.test(p);

  // ── تحديد نوع الكيكة ──────────────────────────────────────────────────────────
  const isWedding = cart.some(item =>
    item.title?.toLowerCase().includes("wedding") ||
    item.category?.toLowerCase().includes("wedding")
  );

  // "نوع آخر" = special category → يومان فقط
  const isSpecial = !isWedding && cart.some(item =>
    item.category?.toLowerCase() === "other" ||
    item.category?.toLowerCase() === "نوع آخر" ||
    item.category?.toLowerCase() === "special"
  );

  // حساب أيام التسليم
  const deliveryDays = isSpecial ? 2 : isWedding ? 14 : 7;

  const calcExpectedDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + deliveryDays);
    return date;
  };

  const deliveryLabel = isSpecial
    ? "~2 days"
    : isWedding
    ? "~2 weeks"
    : "~1 week";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.paymentMethod) {
      toast.error("Please fill all fields"); return;
    }
    if (!validatePhone(formData.phone)) {
      toast.error("Invalid Egyptian phone number"); return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty"); return;
    }
    setShowTerms(true);
  };

  const handleAcceptTerms = async (date) => {
    setShowTerms(false);
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        items: getOrderItems(),
        shippingAddress: {
          name:    formData.name,
          phone:   formData.phone,
          address: formData.address,
        },
        paymentMethod:    formData.paymentMethod,
        expectedDelivery: date.toISOString(),
        termsAccepted:    true,
      });

      localStorage.setItem("pendingOrderId",       data.order._id);
      localStorage.setItem("pendingOrderTotal",    data.order.total);
      localStorage.setItem("paymentMethod",        formData.paymentMethod);
      localStorage.setItem("expectedDeliveryDate", date.toISOString());

      navigate("/payment");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 20;

  return (
    <>
      {showTerms && (
        <TermsModal
          onAccept={handleAcceptTerms}
          onReject={() => setShowTerms(false)}
          expectedDate={calcExpectedDate()}
          deliveryDays={deliveryDays}
          isSpecial={isSpecial}
        />
      )}

      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-10">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="name" placeholder="Your Name"
                className="w-full border p-4 rounded-xl"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="text" name="phone" placeholder="01xxxxxxxxx"
                className="w-full border p-4 rounded-xl"
                value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea name="address" placeholder="City, Street, Building..."
                className="w-full border p-4 rounded-xl" rows={3}
                value={formData.address} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select name="paymentMethod" className="w-full border p-4 rounded-xl"
                value={formData.paymentMethod} onChange={handleChange} required>
                <option value="">Choose Payment Method</option>
                <option value="instapay">Instapay</option>
                <option value="vodafone">Vodafone Cash</option>
              </select>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-2">📋 Order Policy</p>
              <p>• Regular cakes: <strong>1 week</strong> before the occasion 🎂</p>
              <p>• Special / Other category: ready in <strong>2 days</strong> ✨</p>
              <p>• Wedding cakes: <strong>2 weeks</strong> in advance 🤍</p>
            </div>

            <button type="submit" disabled={loading}
              className="bg-pink-600 text-white px-6 py-3 rounded-xl w-full disabled:opacity-60 font-semibold">
              {loading ? "Placing Order..." : "Place Order & Continue →"}
            </button>
          </form>

          {/* Summary */}
          <div className="border rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.map((item) => (
                <div key={item._id || item.id} className="flex justify-between text-sm">
                  <span>{item.title} × {item.qty}</span>
                  <span>EGP {((item.price - (item.price * (item.discount||0)) / 100) * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span><span>EGP {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span><span>EGP {shipping}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span><span>EGP {(subtotal + shipping).toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-700">
              📅 Expected delivery: <strong>{deliveryLabel}</strong> from order date
              {isSpecial  && <span className="block text-xs text-gray-400 mt-0.5">Special category — quick preparation</span>}
              {isWedding  && <span className="block text-xs text-gray-400 mt-0.5">Wedding cake preparation time</span>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
