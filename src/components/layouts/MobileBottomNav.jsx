import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  Plus,
  KeyRound,
  Package,
  Fingerprint,
  Grid3X3,
} from "lucide-react";

const moreSubItems = [
  { to: "/admin/categories", icon: Package, label: "Categories" },
  { to: "/admin/humans", icon: Fingerprint, label: "Humans" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* More sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed bottom-20 left-3 right-3 z-50 md:hidden rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden origin-bottom"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
                  More
                </div>
                {moreSubItems.map((item, i) => (
                  <motion.button
                    key={item.to}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                    onClick={() => {
                      navigate(item.to);
                      setMoreOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive(item.to)
                        ? "bg-black text-white"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-zinc-200 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Users */}
          <button
            onClick={() => { setMoreOpen(false); navigate("/admin/users"); }}
            className="flex flex-col items-center gap-0.5 w-16 py-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-1.5 rounded-xl transition-colors ${
                isActive("/admin/users") ? "text-black" : "text-zinc-400"
              }`}
            >
              <Users className="h-5 w-5" />
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive("/admin/users") ? "text-black" : "text-zinc-400"
            }`}>
              Users
            </span>
          </button>

          {/* Roles */}
          <button
            onClick={() => { setMoreOpen(false); navigate("/admin/roles"); }}
            className="flex flex-col items-center gap-0.5 w-16 py-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-1.5 rounded-xl transition-colors ${
                isActive("/admin/roles") ? "text-black" : "text-zinc-400"
              }`}
            >
              <Shield className="h-5 w-5" />
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive("/admin/roles") ? "text-black" : "text-zinc-400"
            }`}>
              Roles
            </span>
          </button>

          {/* Center + */}
          <button
            onClick={() => { setMoreOpen(false); navigate("/admin/module-generator"); }}
            className="relative -mt-3"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-lg shadow-black/10"
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </button>

          {/* Permissions */}
          <button
            onClick={() => { setMoreOpen(false); navigate("/admin/permissions"); }}
            className="flex flex-col items-center gap-0.5 w-16 py-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-1.5 rounded-xl transition-colors ${
                isActive("/admin/permissions") ? "text-black" : "text-zinc-400"
              }`}
            >
              <KeyRound className="h-5 w-5" />
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive("/admin/permissions") ? "text-black" : "text-zinc-400"
            }`}>
              Perms
            </span>
          </button>

          {/* More */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center gap-0.5 w-16 py-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              animate={{ rotate: moreOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`p-1.5 rounded-xl transition-colors ${
                moreOpen ? "text-black" : "text-zinc-400"
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
              moreOpen ? "text-black" : "text-zinc-400"
            }`}>
              More
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
