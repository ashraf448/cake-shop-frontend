
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../zustand/AuthSlice";

const STATUS_STEPS = [
  "Pending",
  "Quoted",
  "Accepted",
  "Paid",
  "Preparing",
  "Delivered",
];

const STATUS_INFO = {
  Pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
    msg: "We're reviewing your order...",
  },

  Quoted: {
    color: "bg-blue-100 text-blue-700",
    icon: "💰",
    msg: "We've sent you a price quote! Please review and accept.",
  },

  Accepted: {
    color: "bg-purple-100 text-purple-700",
    icon: "✅",
    msg: "Great! Now complete your payment.",
  },

  Paid: {
    color: "bg-green-100 text-green-700",
    icon: "💚",
    msg: "Payment received! We're preparing your cake.",
  },

  Preparing: {
    color: "bg-indigo-100 text-indigo-700",
    icon: "👨‍🍳",
    msg: "Your cake is being prepared!",
  },

  Delivered: {
    color: "bg-green-100 text-green-700",
    icon: "🎉",
    msg: "Your cake has been delivered! Enjoy!",
  },

  Cancelled: {
    color: "bg-red-100 text-red-600",
    icon: "✕",
    msg: "This order has been cancelled.",
  },
};

export default function CustomOrderStatus() {
  const { id } = useParams();

  const navigate = useNavigate();

  const proofRef = useRef();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [accepting, setAccepting] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [confirming, setConfirming] = useState(false);

  const [proofFile, setProofFile] = useState(null);

  const [proofPrev, setProofPrev] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    api
      .get(`/custom-orders/${id}`)
      .then((r) => setOrder(r.data.order))
      .catch(() => navigate("/my-custom-orders"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    setAccepting(true);

    try {
      const { data } = await api.patch(`/custom-orders/${id}/accept`);

      setOrder(data.order);

      toast.success("Quote accepted! Please upload payment proof.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setAccepting(false);
    }
  };

  const handleProofUpload = async () => {
    if (!paymentMethod) {
      toast.error("Please choose payment method");

      return;
    }

    if (!proofFile) {
      toast.error("Please select an image");

      return;
    }

    setUploading(true);

    try {
      const fd = new FormData();

      fd.append("paymentProof", proofFile);

      fd.append("paymentMethod", paymentMethod);

      const { data } = await api.patch(
        `/custom-orders/${id}/payment-proof`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOrder(data.order);

      toast.success("Payment proof uploaded ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelivered = async () => {
    setConfirming(true);

    try {
      const { data } = await api.patch(
        `/custom-orders/${id}/confirm-delivery`
      );

      setOrder(data.order);

      toast.success("Order marked as received 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setConfirming(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl text-gray-400">Loading...</p>
      </div>
    );

  if (!order) return null;

  const info = STATUS_INFO[order.status] || STATUS_INFO.Pending;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  const isCancelled = order.status === "Cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate("/my-custom-orders")}
          className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200"
        >
          ← Back
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            Custom Order #{order._id.slice(-6).toUpperCase()}
          </h1>

          <p className="text-gray-400 text-sm">
            {new Date(order.createdAt).toLocaleDateString("en-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${info.color}`}
      >
        <span className="text-3xl">{info.icon}</span>

        <div>
          <p className="font-bold text-lg">{order.status}</p>

          <p className="text-sm">{info.msg}</p>
        </div>
      </div>

      {/* Stepper */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {

              const done = i <= stepIndex;

              const current = i === stepIndex;

              return (
                <div
                  key={step}
                  className="flex-1 text-center relative"
                >
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className="absolute top-5 left-1/2 w-full h-0.5"
                      style={{
                        background:
                          i < stepIndex ? "#ec4899" : "#e5e7eb",
                      }}
                    />
                  )}

                  <div
                    className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold z-10 relative border-2 ${
                      done
                        ? "bg-pink-500 border-pink-500 text-white"
                        : "bg-white border-gray-200 text-gray-400"
                    } ${current ? "ring-4 ring-pink-100" : ""}`}
                  >
                    {i < stepIndex ? "✓" : i + 1}
                  </div>

                  <p
                    className={`text-xs font-medium ${
                      done ? "text-pink-500" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 space-y-4">

        <h2 className="font-bold text-lg mb-4">
          Order Details
        </h2>

        {order.image && (
          <img
            src={order.image}
            alt="Cake reference"
            className="w-full max-h-64 object-cover rounded-xl border"
          />
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-400">Description</p>

            <p className="font-medium">
              {order.description}
            </p>
          </div>

          {order.size && (
            <div>
              <p className="text-gray-400">Size</p>

              <p className="font-medium">
                {order.size}
              </p>
            </div>
          )}

          {order.flavor && (
            <div>
              <p className="text-gray-400">Flavor</p>

              <p className="font-medium">
                {order.flavor}
              </p>
            </div>
          )}

          {order.layers && (
            <div>
              <p className="text-gray-400">Layers</p>

              <p className="font-medium">
                {order.layers}
              </p>
            </div>
          )}

          {order.deliveryDate && (
            <div>
              <p className="text-gray-400">
                Delivery Date
              </p>

              <p className="font-medium">
                {new Date(order.deliveryDate).toLocaleDateString(
                  "en-EG"
                )}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-400">Phone</p>

            <p className="font-medium">
              {order.phone}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Address</p>

            <p className="font-medium">
              {order.address}
            </p>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      {order.quotedPrice && (
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-6">

          <h2 className="font-bold text-lg mb-3">
            💰 Price Quote
          </h2>

          <p className="text-3xl font-bold text-pink-600 mb-2">
            EGP {order.quotedPrice.toLocaleString()}
          </p>

          {order.adminNote && (
            <p className="text-gray-500 text-sm mb-4">
              Note: {order.adminNote}
            </p>
          )}

          {order.status === "Quoted" && (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {accepting
                ? "Accepting..."
                : "✅ Accept Quote & Pay"}
            </button>
          )}
        </div>
      )}

      {/* Payment Section */}
      {order.status === "Accepted" && !order.isPaid && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="font-bold text-lg mb-4">
            💳 Complete Payment
          </h2>

          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center mb-4">

            <p className="text-sm text-gray-500 mb-1">
              Transfer EGP
            </p>

            <p className="text-3xl font-bold text-pink-600">
              {order.quotedPrice?.toLocaleString()}
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-5">

            <p className="font-medium mb-3">
              Choose Payment Method
            </p>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("Instapay")
                }
                className={`border rounded-xl p-4 text-left transition ${
                  paymentMethod === "Instapay"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-semibold">
                  💳 Instapay
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  01000000000
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("Vodafone Cash")
                }
                className={`border rounded-xl p-4 text-left transition ${
                  paymentMethod === "Vodafone Cash"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-semibold">
                  📱 Vodafone Cash
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  01011111111
                </p>
              </button>
            </div>
          </div>

          {/* Upload */}
          <div
            className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center cursor-pointer hover:border-pink-400 mb-4"
            onClick={() => proofRef.current.click()}
          >
            {proofPrev ? (
              <img
                src={proofPrev}
                alt="proof"
                className="max-h-40 mx-auto rounded-xl"
              />
            ) : (
              <div>
                <div className="text-3xl mb-2">
                  📤
                </div>

                <p className="text-gray-400 text-sm">
                  Upload payment screenshot
                </p>
              </div>
            )}
          </div>

          <input
            ref={proofRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files[0];

              if (f) {
                setProofFile(f);

                setProofPrev(
                  URL.createObjectURL(f)
                );
              }
            }}
          />

          <button
            onClick={handleProofUpload}
            disabled={uploading || !proofFile}
            className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {uploading
              ? "Uploading..."
              : "Confirm Payment ✅"}
          </button>
        </div>
      )}

      {/* Payment Confirmed */}
      {order.isPaid && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center space-y-4">

          <p className="text-green-700 font-bold">
            ✅ Payment confirmed · Your cake is on its way!
          </p>

          {order.status === "Delivered" &&
            !order.received && (
              <button
                onClick={handleConfirmDelivered}
                disabled={confirming}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
              >
                {confirming
                  ? "Confirming..."
                  : "📦 I Received My Order"}
              </button>
            )}

          {order.received && (
            <div className="bg-white border border-green-200 rounded-xl p-3">

              <p className="text-green-700 font-semibold">
                🎉 Order received successfully
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}