import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "../store/slices/authSlice";

export default function AdminRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdminUser = useSelector(selectIsAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
