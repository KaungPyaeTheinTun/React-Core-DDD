import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectHasAdminAccess } from "../store/slices/authSlice";

export default function UserRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasAdminAccess = useSelector(selectHasAdminAccess);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasAdminAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
