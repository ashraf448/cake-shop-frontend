
import { Navigate } from "react-router-dom";

export default function ProtectedPayment({ children }) {

  const proof = localStorage.getItem("paymentProof");

  if (!proof) {
    return <Navigate to="/payment" />;
  }

  return children;
}