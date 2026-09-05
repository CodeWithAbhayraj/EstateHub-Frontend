import { Navigate, Outlet } from "react-router-dom";

function RoleRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let role = null;

  try {
    const user = savedUser
      ? JSON.parse(savedUser)
      : null;

    role = user?.role
      ?.replace("ROLE_", "")
      .trim()
      .toUpperCase();
  } catch (error) {
    console.error("Invalid saved user:", error);
  }

  const normalizedAllowedRoles = allowedRoles.map(
    (allowedRole) =>
      allowedRole
        .replace("ROLE_", "")
        .trim()
        .toUpperCase()
  );

  // Role allowed
  if (
    role &&
    normalizedAllowedRoles.includes(role)
  ) {
    return <Outlet />;
  }

  // Role not allowed
  return <Navigate to="/unauthorized" replace />;
}

export default RoleRoute;