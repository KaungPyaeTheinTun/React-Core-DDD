import { LayoutDashboard } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-white p-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
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
