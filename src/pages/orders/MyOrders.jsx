

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../zustand/AuthSlice";
import toast from "react-hot-toast";

const STATUS_STYLE = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Shipped:   "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const canCancel = (status) => !["Shipped","Delivered","Cancelled"].includes(status);

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get("/orders/my-orders")
      .then((r) => setOrders((r.data.orders || []).filter(o => o.status !== "Delivered")))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmReceipt = async (orderId) => {
    if (!window.confirm("هل تأكد استلام الطلب؟")) return;
    setConfirming(orderId);
    try {
      await api.patch(`/orders/${orderId}/confirm-receipt`);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      toast.success("تم تأكيد الاستلام ✅");
    } catch (err) {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally { setConfirming(null); }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من إلغاء الطلب؟ لا يمكن التراجع عن هذا.")) return;
    setCancelling(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status:"Cancelled" } : o));
      toast.success("تم إلغاء الطلب");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally { setCancelling(null); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <p className="text-xl text-gray-500">Loading orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="text-7xl mb-5">📦</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">No orders yet</h2>
      <Link to="/products" className="bg-black text-white px-6 py-3 rounded-2xl">Start Shopping</Link>
    </div>
  );

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow-md rounded-2xl p-5 border">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
              <div>
                <h2 className="font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-EG", { day:"numeric", month:"long", year:"numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLE[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {order.isPaid ? "✅ Paid" : "⏳ Unpaid"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              {order.items?.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{item.title} × {item.qty}</span>
                  <span>EGP {((item.price - (item.price * (item.discount||0)) / 100) * item.qty).toFixed(0)}</span>
                </div>
              ))}
              {order.items?.length > 3 && <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>}
            </div>

            {order.status === "Shipped" && (
              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
                <span className="text-xl">🚚</span>
                <p className="text-sm text-indigo-700 flex-1">طلبك في الطريق إليك! لما تستلمه اضغط الزرار.</p>
              </div>
            )}

            {order.status === "Cancelled" && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                <span className="text-xl">❌</span>
                <p className="text-sm text-red-600">تم إلغاء هذا الطلب.</p>
              </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="font-bold text-lg">Total: EGP {order.total?.toLocaleString()}</p>
              <div className="flex gap-3 flex-wrap justify-end">
                <Link to={`/orders/${order._id}`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition">
                  Details
                </Link>
                {order.status !== "Cancelled" && (
                  <Link to={`/track-order/${order._id}`}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:opacity-80 transition">
                    Track Order
                  </Link>
                )}
                {order.status === "Shipped" && (
                  <button onClick={() => handleConfirmReceipt(order._id)}
                    disabled={confirming === order._id}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition disabled:opacity-60 font-medium">
                    {confirming === order._id ? "جاري التأكيد..." : "✅ استلمت الطلب"}
                  </button>
                )}
                {canCancel(order.status) && (
                  <button onClick={() => handleCancel(order._id)}
                    disabled={cancelling === order._id}
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm hover:bg-red-100 transition disabled:opacity-60 font-medium">
                    {cancelling === order._id ? "جاري الإلغاء..." : "✕ إلغاء الطلب"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
