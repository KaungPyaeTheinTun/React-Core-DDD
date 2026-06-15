import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  ChevronDown,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { selectRoles } from "../../store/slices/authSlice";

export default function Header({ currentUser, onLogout, sidebarCollapsed, onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const roles = useSelector(selectRoles);

  const panelLabel = roles.some((r) => r.toLowerCase() === "editor")
    ? "Editor Panel"
    : "Admin Panel";

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownAnimation = {
    hidden: { opacity: 0, y: -12, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 28 },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.15, ease: "easeOut" },
    },
  };

  return (
    <header className="h-16 w-full border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 text-black">
      <div className="flex items-center gap-3">
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:inline-flex rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-black">
          {panelLabel}
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5 md:px-3 md:py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-50 transition"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-black font-bold uppercase shrink-0">
            {currentUser?.fullName?.charAt(0) || "U"}
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate">
            {currentUser?.fullName || "Admin Profile"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              key="profile-dropdown-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownAnimation}
              className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg z-50"
            >
              <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Logged in as
                </p>
                <p className="text-xs text-zinc-800 truncate font-medium">
                  {currentUser?.email || "admin@system.com"}
                </p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 hover:text-black transition"
              >
                <LogOut className="h-4 w-4" /> Sign Out Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
