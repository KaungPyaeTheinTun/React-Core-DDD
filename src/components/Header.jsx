import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FileCode2,
  LogOut,
  ChevronDown,
  Users,
  Package,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ currentUser, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileTriggerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileTriggerRef.current &&
        !mobileTriggerRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
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

  const getNavClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
      isActive
        ? "bg-black text-white"
        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
    }`;

  const getMobileNavClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition w-full text-left ${
      isActive
        ? "bg-black text-white"
        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
    }`;

  return (
    <header className="h-16 w-full border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 text-black">
      <div className="flex items-center gap-4">
        <button
          ref={mobileTriggerRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block md:hidden rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/users" className={getNavClass}>
            <Users className="h-4 w-4" /> Users
          </NavLink>
          <NavLink to="/categories" className={getNavClass}>
            <Package className="h-4 w-4" /> Categories
          </NavLink>
          <NavLink to="/module-generator" className={getNavClass}>
            <FileCode2 className="h-4 w-4" /> Generator
          </NavLink>
        </nav>

        <span className="block md:hidden text-xs font-bold uppercase tracking-wider text-black">
          Dashboard
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-navigation-drawer"
            ref={mobileMenuRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownAnimation}
            className="absolute top-16 left-0 right-0 border-b border-zinc-200 bg-white p-4 space-y-2 flex flex-col md:hidden shadow-xl z-40"
          >
            <NavLink
              to="/users"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileNavClass}
            >
              <Users className="h-4 w-4" /> Users
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileNavClass}
            >
              <Package className="h-4 w-4" /> Categories
            </NavLink>
            <NavLink
              to="/module-generator"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileNavClass}
            >
              <FileCode2 className="h-4 w-4" /> Generator
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
