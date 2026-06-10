import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { Slide, ToastContainer } from "react-toastify";

import AdminLayout from "../components/AdminLayout.jsx";
import Spinner from "../components/Spinner.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.jsx"));
const UsersPage = lazy(() => import("../pages/UsersPage.jsx"));
const CategoryPage = lazy(() => import("../pages/CategoriesPage.jsx"));
const ModuleGeneratorPage = lazy(() => import("../pages/ModuleGeneratorPage.jsx"));

function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-white text-black p-4">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center max-w-sm w-full">
        <LayoutDashboard className="mx-auto mb-4 h-10 w-10 text-black" />

        <h1 className="text-xl font-bold uppercase tracking-wider">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Use the navigation or return to login.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/module-generator" element={<ModuleGeneratorPage />} />
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
