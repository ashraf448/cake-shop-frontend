

import { useNavigate } from "react-router-dom";

// أرقام الدفع — غيّرهم لأرقامك الحقيقية
const PAYMENT_NUMBERS = {
  instapay: "01014610669",
  vodafone: "01014610669",
};

export default function Payment() {
  const navigate      = useNavigate();
  const orderId       = localStorage.getItem("pendingOrderId");
  const orderTotal    = localStorage.getItem("pendingOrderTotal");
  const paymentMethod = localStorage.getItem("paymentMethod");

  // لو ما فيش أوردر معلق، ودّيه للـ checkout
  if (!orderId) {
    navigate("/checkout");
    return null;
  }

  const number = PAYMENT_NUMBERS[paymentMethod] || "01000000000";
  const label  = paymentMethod === "instapay" ? "Instapay" : "Vodafone Cash";

  return (
    <section className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      <div className="border p-6 rounded-2xl space-y-6 bg-white shadow">

        {/* Order info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-bold">#{orderId.slice(-6).toUpperCase()}</p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-pink-600">EGP {Number(orderTotal).toLocaleString()}</p>
        </div>

        {/* Payment method */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Payment Method</p>
          <p className="font-bold capitalize">{label}</p>
        </div>

        {/* Number */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Transfer To</p>
          <p className="text-2xl font-bold text-pink-600 tracking-widest">{number}</p>
          <p className="text-xs text-gray-400 mt-2">
            Copy this number and complete the transfer, then upload proof below.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          ⚠️ Complete the payment before uploading proof. Your order will be confirmed after verification.
        </div>

        <button
          onClick={() => navigate("/upload-payment")}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl w-full text-lg font-semibold"
        >
          I Paid — Upload Proof →
        </button>

      </div>
    </section>
  );
}
