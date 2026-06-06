import { Link } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { useAuth } from "../hooks/useAuth.js"; // Import Unified Hook

export default function RegisterPage() {
  const { formData, error, loading, handleChange, handleAuthSubmit } =
    useAuth();

  return (
    <div className="grid min-h-screen place-items-center bg-white p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <SectionCard title="Register">
          {/* Submit with isRegister set to true */}
          <form
            onSubmit={(e) => handleAuthSubmit(e, true)}
            className="space-y-4"
          >
            {error && (
              <div className="text-xs font-bold uppercase tracking-wide text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <FormInput
              placeholder="Full name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <FormInput
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-zinc-800 disabled:opacity-40 transition uppercase text-xs tracking-wider"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-xs text-zinc-500 uppercase tracking-wide">
              Have an account?{" "}
              <Link
                className="text-black font-bold hover:underline underline-offset-4 ml-1"
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
