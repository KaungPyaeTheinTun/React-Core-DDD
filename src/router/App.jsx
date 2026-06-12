import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

import AdminLayout from "../components/layouts/AdminLayout.jsx";
import UserLayout from "../components/layouts/UserLayout.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import UserRoute from "./UserRoute.jsx";

const LoginPage = lazy(() => import("../pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.jsx"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage.jsx"));

const UsersPage = lazy(() => import("../pages/admin/UsersPage.jsx"));
const UserRolesPage = lazy(() => import("../pages/admin/UserRolesPage.jsx"));
const CategoriesPage = lazy(() => import("../pages/admin/CategoriesPage.jsx"));
const RolesPage = lazy(() => import("../pages/admin/RolesPage.jsx"));
const RolesPermissionsPage = lazy(() => import("../pages/admin/RolesPermissionsPage.jsx"));
const PermissionsPage = lazy(() => import("../pages/admin/PermissionsPage.jsx"));
const ModuleGeneratorPage = lazy(() => import("../pages/admin/ModuleGeneratorPage.jsx"));

const DashboardPage = lazy(() => import("../pages/user/DashboardPage.jsx"));
const ProfilePage = lazy(() => import("../pages/user/ProfilePage.jsx"));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
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
