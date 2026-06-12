import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../store/slices/authSlice";

export default function UserLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-zinc-900 selection:bg-black selection:text-white">
      <header className="h-16 w-full border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 text-black">
        <span className="text-xs font-bold uppercase tracking-wider text-black">
          User Dashboard
        </span>
        <button
          onClick={handleLogout}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 hover:text-black transition"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-full overflow-x-hidden animate-in fade-in duration-300">
        <Outlet />
      </main>
    </div>
  );
}
