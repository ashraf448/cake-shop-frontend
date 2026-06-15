import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PaymentButton({ formData }) {
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!formData) {
      toast.error("Fill form first");
      return;
    }

    toast.loading("Processing payment...");

    setTimeout(() => {
      toast.dismiss();

      const newOrder = {
        id: Date.now(),
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString(),
        items: JSON.parse(localStorage.getItem("cart")) || [],
        total: 270,
      };

      const oldOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      localStorage.setItem(
        "orders",
        JSON.stringify([...oldOrders, newOrder])
      );

      localStorage.removeItem("cart");

      toast.success("Order Created Successfully");

      navigate("/order-success");
    }, 2000);
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-black text-white px-6 py-3 rounded-xl w-full"
    >
      Pay Now
    </button>
  );
}