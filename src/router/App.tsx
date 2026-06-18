import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import { selectAnyLoading } from "../store/slices/crudSlice";

import AdminLayout from "../components/layouts/AdminLayout";
import UserLayout from "../components/layouts/UserLayout";
import Spinner from "../components/ui/Spinner";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));

const UsersPage = lazy(() => import("../pages/admin/UsersPage"));
const UserRolesPage = lazy(() => import("../pages/admin/UserRolesPage"));
const CategoriesPage = lazy(() => import("../pages/admin/CategoriesPage"));
const RolesPage = lazy(() => import("../pages/admin/RolesPage"));
const RolesPermissionsPage = lazy(() => import("../pages/admin/RolesPermissionsPage"));
const PermissionsPage = lazy(() => import("../pages/admin/PermissionsPage"));
const ModuleGeneratorPage = lazy(() => import("../pages/admin/ModuleGeneratorPage"));
const HumansPage = lazy(() => import("../pages/admin/HumansPage"));
const CommonTablesPage = lazy(() => import("../pages/admin/CommonTablesPage"));
const MessengerPage = lazy(() => import("../pages/admin/MessengerPage"));
const ProductsPage = lazy(() => import("../pages/admin/ProductsPage"));

const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/user/ProfilePage"));

export default function App() {
  const anyLoading = useSelector(selectAnyLoading);

  return (
    <Suspense fallback={<Spinner />}>
      {anyLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <Spinner />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:id/roles" element={<UserRolesPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/roles" element={<RolesPage />} />
              <Route path="/admin/roles/:id/permissions" element={<RolesPermissionsPage />} />
              <Route path="/admin/permissions" element={<PermissionsPage />} />
              <Route path="/admin/module-generator" element={<ModuleGeneratorPage />} />
              <Route path="/admin/humans" element={<HumansPage />} />
              <Route path="/admin/common-tables" element={<CommonTablesPage />} />
              <Route path="/admin/messenger" element={<MessengerPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
            </Route>
          </Route>
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<DashboardPage />} />
              <Route path="/user/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        transition={Slide}
        autoClose={4000}
        hideProgressBar
        closeButton={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
}
