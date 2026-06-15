import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../zustand/AuthSlice";

const STEPS = ["Pending", "Confirmed", "Preparing", "Shipped", "Delivered"];

const STATUS_COLOR = {
  Pending:   "#f0c040",
  Confirmed: "#1a73e8",
  Preparing: "#7b3fd4",
  Shipped:   "#0891b2",
  Delivered: "#2d9b6f",
  Cancelled: "#d94040",
};

const STATUS_BG = {
  Pending:   "#fef9ec",
  Confirmed: "#e8f0fe",
  Preparing: "#f3eeff",
  Shipped:   "#e0f7fa",
  Delivered: "#e6f5ee",
  Cancelled: "#fdecea",
};

export default function OrderDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data.order))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <p className="text-xl text-gray-500">Loading...</p>
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="text-5xl mb-4">❌</div>
      <h2 className="text-xl font-bold mb-4">Order not found</h2>
      <Link to="/my-orders" className="bg-black text-white px-6 py-3 rounded-xl">← My Orders</Link>
    </div>
  );

  const isCancelled = order.status === "Cancelled";
  const currentStep = isCancelled ? -1 : STEPS.indexOf(order.status);

  // only history entries that have an admin note
  const adminMessages = (order.statusHistory || []).filter(h => h.note?.trim());

  return (
    <section className="max-w-4xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/my-orders")}
          className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200">
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt).toLocaleDateString("en-EG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: STATUS_BG[order.status] || "#f5f5f5", color: STATUS_COLOR[order.status] || "#999" }}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-6">Order Tracking</h2>
        {isCancelled ? (
          <div className="text-center py-4 text-red-500 font-bold">✕ This order has been cancelled</div>
        ) : (
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const done    = i < currentStep || order.status === "Delivered";
              const current = i === currentStep && order.status !== "Delivered";
              return (
                <div key={step} className="flex-1 text-center relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5"
                      style={{ background: done ? "#2d9b6f" : "#e5e7eb" }} />
                  )}
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center relative z-10 text-sm font-bold border-2"
                    style={{
                      background:  done ? "#2d9b6f" : current ? "#e6f0ff" : "#fff",
                      color:       done ? "#fff"    : current ? "#1a73e8" : "#9ca3af",
                      borderColor: done ? "#2d9b6f" : current ? "#1a73e8" : "#e5e7eb",
                    }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <p className="text-xs" style={{ color: done ? "#2d9b6f" : current ? "#1a73e8" : "#9ca3af", fontWeight: current ? 600 : 400 }}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Admin Messages ── */}
      {adminMessages.length > 0 && (
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span>💬</span> Messages from the Shop
          </h2>
          <div className="flex flex-col gap-4">
            {adminMessages.map((h, i) => (
              <div key={i} className="flex gap-3">
                {/* avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ background: STATUS_BG[h.status] || "#f5f5f5" }}>
                  🎂
                </div>
                {/* bubble */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[h.status] || "#999" }}>
                      Amira Cakes
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(h.changedAt).toLocaleDateString("en-EG", {
                        day: "numeric", month: "short",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full ml-1"
                      style={{ background: STATUS_BG[h.status] || "#f5f5f5", color: STATUS_COLOR[h.status] || "#999" }}>
                      {h.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{h.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Items */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => {
              const discounted = item.price - (item.price * (item.discount || 0)) / 100;
              return (
                <div key={i} className="flex items-center gap-4">
                  {(item.image || item.product?.image) && (
                    <img src={item.image || item.product?.image} alt=""
                      className="w-14 h-14 object-cover rounded-xl border" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title || item.product?.title}</p>
                    <p className="text-gray-400 text-xs">× {item.qty}</p>
                  </div>
                  <p className="font-bold text-sm">EGP {(discounted * item.qty).toFixed(0)}</p>
                </div>
              );
            })}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>EGP {order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span><span>EGP {order.shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span><span>EGP {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping + Payment */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-bold mb-4">Shipping & Payment</h2>

          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase mb-2">📍 Shipping Address</p>
            <p className="font-medium">{order.shippingAddress?.name}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress?.phone}</p>
            <p className="text-gray-500 text-sm">{order.shippingAddress?.address}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">💳 Payment</p>
            <p className="font-medium capitalize">{order.paymentMethod}</p>
            <p className={`text-sm mt-1 ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
              {order.isPaid
                ? `✅ Paid · ${order.paidAt ? new Date(order.paidAt).toLocaleDateString("en-EG") : ""}`
                : "⏳ Awaiting payment verification"
              }
            </p>
          </div>

          {order.paymentProof && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase mb-2">Payment Proof</p>
              <img src={order.paymentProof} alt="Payment proof"
                className="w-full rounded-xl border object-cover max-h-48"
                onError={e => e.target.style.display = "none"} />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}