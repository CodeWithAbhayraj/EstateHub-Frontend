import { Navigate, Outlet } from "react-router-dom";

function RoleRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Login nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role allowed nahi hai
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role allowed hai
  return <Outlet />;
}

export default RoleRoute;