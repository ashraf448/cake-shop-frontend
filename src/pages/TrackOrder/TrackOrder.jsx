
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../zustand/AuthSlice";
import toast from "react-hot-toast";

const STEPS = ["Pending", "Confirmed", "Preparing", "Shipped", "Delivered"];

const STEP_CONFIG = {
  Pending:   { icon:"🕐", label:"Order Placed",     desc:"We received your order and it's being reviewed." },
  Confirmed: { icon:"✅", label:"Payment Confirmed", desc:"Your payment has been verified successfully." },
  Preparing: { icon:"👨‍🍳", label:"Being Prepared",   desc:"Your cake is being made with love!" },
  Shipped:   { icon:"🚚", label:"Out for Delivery",  desc:"Your order is on its way to you." },
  Delivered: { icon:"🎉", label:"Delivered",         desc:"Your order has been delivered. Enjoy!" },
};

const fmt     = (d) => d ? new Date(d).toLocaleDateString("en-EG", { day:"numeric", month:"long", year:"numeric" }) : null;
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-EG", { hour:"2-digit", minute:"2-digit" }) : null;

// ─── Payment Upload Modal ──────────────────────────────────────────────────────
function PaymentModal({ orderId, orderTotal, onClose, onSuccess }) {
  const fileRef = useRef();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW
  const [paymentMethod, setPaymentMethod] = useState("");

  const NUMBERS = {
    instapay: "01014610669",
    vodafone: "01014610669",
  };

  const number = NUMBERS[paymentMethod] || "";
  const label =
    paymentMethod === "instapay"
      ? "Instapay"
      : paymentMethod === "vodafone"
      ? "Vodafone Cash"
      : "";

  const handleFile = (e) => {
    const f = e.target.files[0];

    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Images only");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Choose payment method");
      return;
    }

    if (!file) {
      toast.error("Please upload payment screenshot");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("paymentProof", file);

      // NEW
      fd.append("paymentMethod", paymentMethod);

      await api.patch(`/orders/${orderId}/payment-proof`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Payment proof uploaded ✅");

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">💳 Complete Payment</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* TOTAL */}
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-center mb-4">
          <p className="text-sm text-gray-400 mb-1">
            Amount to Pay
          </p>

          <p className="text-3xl font-bold text-pink-600">
            EGP {Number(orderTotal).toLocaleString()}
          </p>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Payment Method
          </label>

          <select
            className="w-full border p-4 rounded-xl"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Choose Payment Method</option>
            <option value="instapay">Instapay</option>
            <option value="vodafone">Vodafone Cash</option>
          </select>
        </div>

        {/* NUMBER */}
        {paymentMethod && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center mb-4">
            <p className="text-sm text-gray-400 mb-1">
              Transfer To ({label})
            </p>

            <p className="text-2xl font-bold tracking-widest text-gray-800">
              {number}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Complete transfer then upload screenshot below
            </p>
          </div>
        )}

        {/* UPLOAD */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-pink-400 transition mb-3"
          onClick={() => fileRef.current.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="proof"
              className="max-h-40 mx-auto rounded-xl object-contain"
            />
          ) : (
            <div>
              <div className="text-4xl mb-2">📤</div>

              <p className="text-gray-400 text-sm">
                Click to upload payment screenshot
              </p>

              <p className="text-xs text-gray-300 mt-1">
                JPEG / PNG · max 5MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        {preview && (
          <button
            onClick={() => {
              setFile(null);
              setPreview("");
            }}
            className="text-xs text-red-400 underline mb-3 block"
          >
            Remove image
          </button>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !file || !paymentMethod}
            className="flex-1 bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Uploading..." : "Confirm Payment ✅"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function TrackOrder() {
  const { id }    = useParams();
  const [data,    setData]       = useState(null);
  const [loading, setLoading]    = useState(true);
  const [error,   setError]      = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api.get(`/orders/${id}/track`)
      .then((r) => setData(r.data.tracking))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="text-5xl animate-bounce">📦</div>
      <p className="text-gray-400 text-lg">Tracking your order...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="text-5xl mb-4">❌</div>
      <h2 className="text-xl font-bold mb-4">Order not found</h2>
      <Link to="/my-orders" className="bg-black text-white px-6 py-3 rounded-xl">← My Orders</Link>
    </div>
  );

  const { status, stepIndex, timeline, isCancelled, createdAt, paidAt,
          shippingAddress, itemCount, isPaid, total, paymentMethod, expectedDelivery } = data;

  const currentConfig = STEP_CONFIG[status] || STEP_CONFIG.Pending;
  const canPay = !isPaid && !isCancelled && status !== "Delivered";

  return (
    <>
      {showPayment && (
        <PaymentModal
          orderId={id}
          orderTotal={total}
          paymentMethod={paymentMethod}
          onClose={() => setShowPayment(false)}
          onSuccess={fetchData}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/my-orders" className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition">← Back</Link>
          <div>
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-gray-400 text-sm">#{id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        {/* Payment warning banner */}
        {canPay && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-bold text-amber-800 text-sm">Payment Pending</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  Your order is waiting for payment. Complete payment to proceed.
                </p>
              </div>
            </div>
            <button onClick={() => setShowPayment(true)}
              className="bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-600 transition shrink-0">
              💳 Pay Now
            </button>
          </div>
        )}

        {/* Status banner */}
        <div className={`rounded-2xl p-6 mb-6 text-center ${
          isCancelled ? "bg-red-50 border border-red-200"
          : status === "Delivered" ? "bg-green-50 border border-green-200"
          : "bg-linear-to-r from-pink-50 to-pink-100 border border-pink-200"
        }`}>
          <div className="text-5xl mb-3">{isCancelled ? "✕" : currentConfig.icon}</div>
          <h2 className={`text-2xl font-bold mb-1 ${isCancelled?"text-red-600":status==="Delivered"?"text-green-700":"text-pink-700"}`}>
            {isCancelled ? "Order Cancelled" : currentConfig.label}
          </h2>
          <p className="text-gray-500 text-sm">{isCancelled ? "This order has been cancelled." : currentConfig.desc}</p>
          {shippingAddress && (
            <p className="text-xs text-gray-400 mt-2">📍 {shippingAddress.address} · {shippingAddress.phone}</p>
          )}
          {expectedDelivery && !isCancelled && (
            <p className="text-xs text-gray-400 mt-1">
              📅 Expected delivery: {fmt(expectedDelivery)}
            </p>
          )}
        </div>

        {/* Progress */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Order Progress</span>
              <span className="text-sm text-gray-400">{stepIndex + 1} / {STEPS.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div className="h-2 rounded-full transition-all duration-500"
                style={{ width:`${((stepIndex+1)/STEPS.length)*100}%`, background:status==="Delivered"?"#2d9b6f":"#ec4899" }} />
            </div>
            <div className="flex items-start">
              {STEPS.map((step, i) => {
                const done    = i <= stepIndex;
                const current = i === stepIndex;
                const cfg     = STEP_CONFIG[step];
                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {i < STEPS.length-1 && (
                      <div className="absolute top-5 left-1/2 w-full h-0.5 transition-all"
                        style={{ background:i<stepIndex?"#ec4899":"#e5e7eb" }} />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold z-10 border-2 transition-all ${
                      done?"border-pink-500 bg-pink-500 text-white":"border-gray-200 bg-white text-gray-400"
                    } ${current?"ring-4 ring-pink-100 scale-110":""}`}>
                      {i < stepIndex ? "✓" : cfg.icon}
                    </div>
                    <p className={`mt-2 text-xs text-center font-medium px-1 leading-tight ${done?"text-pink-600":"text-gray-400"}`}>
                      {cfg.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-bold text-base mb-5">📋 Order Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
            <div className="space-y-5">
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs z-10 shrink-0">🛒</div>
                <div className="pt-0.5">
                  <p className="font-semibold text-sm">Order Placed</p>
                  <p className="text-xs text-gray-400">{fmt(createdAt)} · {fmtTime(createdAt)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{itemCount} item{itemCount>1?"s":""} ordered</p>
                </div>
              </div>
              {timeline?.filter(t=>t.done&&t.step!=="Pending").map(t => {
                const cfg   = STEP_CONFIG[t.step];
                const isNow = t.step===status&&!isCancelled;
                return (
                  <div key={t.step} className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shrink-0 ${isNow?"bg-pink-500":"bg-green-500"} text-white`}>
                      {cfg?.icon||"✓"}
                    </div>
                    <div className="pt-0.5">
                      <p className="font-semibold text-sm">{cfg?.label||t.step}</p>
                      <p className="text-xs text-gray-400">{t.timestamp?`${fmt(t.timestamp)} · ${fmtTime(t.timestamp)}`:"—"}</p>
                      {t.note&&<p className="text-xs text-gray-500 mt-0.5 italic">{t.note}</p>}
                    </div>
                  </div>
                );
              })}
              {isCancelled && (
                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs z-10 shrink-0">✕</div>
                  <div className="pt-0.5">
                    <p className="font-semibold text-sm text-red-600">Order Cancelled</p>
                    <p className="text-xs text-gray-400">This order was cancelled.</p>
                  </div>
                </div>
              )}
              {!isCancelled&&timeline?.filter(t=>!t.done).map(t => {
                const cfg=STEP_CONFIG[t.step];
                return (
                  <div key={t.step} className="flex gap-4 relative opacity-35">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm z-10 shrink-0">{cfg?.icon}</div>
                    <div className="pt-0.5">
                      <p className="font-semibold text-sm text-gray-400">{cfg?.label||t.step}</p>
                      <p className="text-xs text-gray-300">Upcoming</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment verified */}
        {paidAt && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">💚</span>
            <div>
              <p className="text-green-700 font-semibold text-sm">Payment Verified</p>
              <p className="text-green-600 text-xs">{fmt(paidAt)} · {fmtTime(paidAt)}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          {canPay && (
            <button onClick={() => setShowPayment(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition text-sm font-semibold">
              💳 Complete Payment
            </button>
          )}
          <Link to={`/orders/${id}`} className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-80 transition text-sm font-medium">
            View Full Details
          </Link>
          <Link to="/my-orders" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition text-sm font-medium">
            My Orders
          </Link>
        </div>

      </div>
    </>
  );
}
