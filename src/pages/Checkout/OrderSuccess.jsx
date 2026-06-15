

import { Link } from "react-router-dom";

export default function OrderSuccess() {

  return (
    <section className="h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-green-600 mb-5">
          Order Success
        </h1>

        <p className="text-gray-600 mb-6">
          Payment submitted successfully
        </p>

        <Link
          to="/my-orders"
          className="bg-pink-600 text-white px-6 py-3 rounded-xl"
        >
          My Orders
        </Link>

      </div>
    </section>
  );
}