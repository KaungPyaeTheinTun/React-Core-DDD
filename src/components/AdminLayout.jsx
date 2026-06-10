import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    // Added text-zinc-900, max-w-full, and overflow-x-hidden here
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-zinc-900 selection:bg-black selection:text-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      {/* Added max-w-full overflow-x-hidden to the main element container */}
      <main className="max-w-full overflow-x-hidden animate-in fade-in duration-300">
        <Outlet />
      </main>
    </div>
  );
}
