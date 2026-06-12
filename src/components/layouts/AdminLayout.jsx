import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { logout, selectUser } from "../../store/slices/authSlice";

const SIDEBAR_STORAGE_KEY = "admin_sidebar_collapsed";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-zinc-900 selection:bg-black selection:text-white">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onMobileOpen={() => setMobileSidebarOpen(true)}
      />

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
