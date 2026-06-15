import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../zustand/AuthSlice";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please login first</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-10">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      {/* USER INFO */}
      <div className="bg-white shadow rounded-2xl p-6 mb-8">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {currentUser?.name}
            </h2>

            <p className="text-gray-500">
              {currentUser?.email}
            </p>
          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* My Orders */}
        <Link
          to="/my-orders"
          className="bg-black text-white p-6 rounded-2xl hover:opacity-90 transition"
        >
          <h3 className="text-lg font-bold">My Orders</h3>
          <p className="text-sm opacity-80">
            Track and view your orders
          </p>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="bg-gray-900 text-white p-6 rounded-2xl hover:opacity-90 transition"
        >
          <h3 className="text-lg font-bold">Wishlist</h3>
          <p className="text-sm opacity-80">
            Your saved products
          </p>
        </Link>

      </div>

      {/* EXTRA ACTIONS */}
      <div className="mt-8 bg-white shadow rounded-2xl p-6 space-y-4">

        <button
          onClick={() => navigate("/track-order")}
          className="w-full border py-3 rounded-xl hover:bg-gray-100"
        >
          Track Order
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

    </div>
  );
}