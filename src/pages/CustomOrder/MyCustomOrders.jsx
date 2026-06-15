
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../zustand/AuthSlice";

const STATUS_STYLE = {
  Pending: "bg-yellow-100 text-yellow-700",

  Quoted: "bg-blue-100 text-blue-700",

  Accepted: "bg-purple-100 text-purple-700",

  Paid: "bg-green-100 text-green-700",

  Preparing: "bg-indigo-100 text-indigo-700",

  Delivered: "bg-green-100 text-green-700",

  Cancelled: "bg-red-100 text-red-600",
};

export default function MyCustomOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/custom-orders/my-orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl text-gray-400">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          🎂 My Custom Orders
        </h1>

        <Link
          to="/custom-order"
          className="bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600 transition text-sm"
        >
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh]">

          <div className="text-6xl mb-4">
            🎂
          </div>

          <h2 className="text-xl font-bold text-gray-600 mb-2">
            No custom orders yet
          </h2>

          <p className="text-gray-400 mb-6">
            Design your dream cake!
          </p>

          <Link
            to="/custom-order"
            className="bg-pink-500 text-white px-6 py-3 rounded-xl"
          >
            Order Custom Cake
          </Link>
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/custom-orders/${order._id}`}
              className="block bg-white rounded-2xl shadow hover:shadow-md transition p-5 border"
            >

              <div className="flex items-start gap-4">

                {order.image ? (
                  <img
                    src={order.image}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-pink-50 flex items-center justify-center text-2xl shrink-0">
                    🎂
                  </div>
                )}

                <div className="flex-1">

                  <div className="flex justify-between items-start mb-2">

                    <p className="font-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLE[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2">
                    {order.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">

                    {order.size && (
                      <span>
                        📏 {order.size}
                      </span>
                    )}

                    {order.flavor && (
                      <span>
                        🍰 {order.flavor}
                      </span>
                    )}

                    {order.quotedPrice && (
                      <span className="text-pink-600 font-semibold">
                        EGP{" "}
                        {order.quotedPrice.toLocaleString()}
                      </span>
                    )}

                    {order.paymentMethod && (
                      <span>
                        💳 {order.paymentMethod}
                      </span>
                    )}

                    {order.received && (
                      <span className="text-green-600 font-semibold">
                        ✅ Received
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}