import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import AdminLayout from "./components/AdminLayout.jsx";
import { Slide, ToastContainer } from "react-toastify";

const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const UsersPage = lazy(() => import("./pages/UsersPage.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx"));

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center bg-white text-zinc-900 font-medium tracking-wide">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        <Route
          path="*"
          element={
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
          }
        />
      </Routes>

      <ToastContainer
        position="bottom-right"
        transition={Slide} // Smoothly slides in from the screen edge boundary
        autoClose={4000}
        hideProgressBar={true} // Removes the baseline timer bar for a premium UI feel
        closeButton={false} // Drops the default 'X' button to mirror native notifications
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
}
