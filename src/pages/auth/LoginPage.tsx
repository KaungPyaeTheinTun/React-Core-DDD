import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "../../components/ui/FormInput";
import SectionCard from "../../components/ui/SectionCard";
import { selectAuth } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { handleAuthSubmit } = useAuth();
  const { loading, error } = useSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-white p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <SectionCard title="Login">
          <form
            onSubmit={(e) => handleAuthSubmit(e, false)}
            className="space-y-4"
          >
            {error && (
              <div className="text-xs font-bold uppercase tracking-wide text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <FormInput
              placeholder="Email"
              type="email"
              name="email"
              required
            />
            <div className="relative">
              <FormInput
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-zinc-800 disabled:opacity-40 transition uppercase text-xs tracking-wider"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-xs text-zinc-500 uppercase tracking-wide">
              No account?{" "}
              <Link
                className="text-black font-bold hover:underline underline-offset-4 ml-1"
                to="/register"
              >
                Register
              </Link>
            </p>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
