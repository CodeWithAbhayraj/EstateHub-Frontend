import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // User login nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Login hai
  return <Outlet />;
}

export default ProtectedRoute;