import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectHasAdminAccess } from "../store/slices/authSlice";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const hasAdminAccess = useSelector(selectHasAdminAccess);

  const handleBack = () => {
    if (hasAdminAccess) {
      navigate("/admin/users", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-white p-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold uppercase tracking-wider text-black">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          You don't have permission to access this page.
        </p>
        <button
          onClick={handleBack}
          className="mt-6 inline-block rounded-xl bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
