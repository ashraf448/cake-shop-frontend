import { Navigate } from "react-router-dom";

import useCart from "../../zustand/cartSlice";

import useAuth from "../../zustand/AuthSlice";

export default function ProtectedCheckout({
  children,
}) {

  const { cart } = useCart();

  const { currentUser } = useAuth();

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // =========================
  // EMPTY CART
  // =========================
  if (cart.length === 0) {
    return <Navigate to="/cart" />;
  }

  // =========================
  // ACCESS ALLOWED
  // =========================
  return children;
}