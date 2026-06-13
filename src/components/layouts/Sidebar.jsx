import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Package,
  Shield,
  KeyRound,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
} from "lucide-react";

const navItems = [
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/humans", icon: Fingerprint, label: "Humans" },
  { to: "/admin/categories", icon: Package, label: "Categories" },
  { to: "/admin/roles", icon: Shield, label: "Roles" },
  { to: "/admin/permissions", icon: KeyRound, label: "Permissions" },
  { to: "/admin/module-generator", icon: FileCode2, label: "Generator" },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
      isActive
        ? "bg-black text-white shadow-sm"
        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col border-r border-zinc-200 bg-white h-[calc(100vh-4rem)] sticky top-16 z-40 overflow-hidden"
      >
        <div className="flex flex-col flex-1 gap-1 p-2 overflow-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
              title={collapsed ? item.label : undefined}
            >
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                <item.icon className="h-4 w-4" />
              </div>

              <AnimatePresence>
                {collapsed && hoveredItem === item.to && (
                  <motion.div
                    initial={{ opacity: 0, x: -6, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap pointer-events-none z-50 shadow-lg"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.span
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
        </div>

        <div className="border-t border-zinc-200 p-2">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full h-9 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-zinc-200 z-50 md:hidden flex flex-col"
            >
              <div className="h-16 flex items-center px-4 border-b border-zinc-200">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Navigation
                </span>
              </div>

              <div className="flex flex-col flex-1 gap-1 p-3 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onMobileClose}
                    className={linkClass}
                  >
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
