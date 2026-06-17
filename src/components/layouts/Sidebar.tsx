import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  Database,
  MessageSquare,
  type LucideProps,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ComponentType<LucideProps>;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/humans", icon: Fingerprint, label: "Humans" },
  { to: "/admin/categories", icon: Package, label: "Categories" },
  { to: "/admin/common-tables", icon: Database, label: "Common Table" },
  { to: "/admin/roles", icon: Shield, label: "Roles" },
  { to: "/admin/permissions", icon: KeyRound, label: "Permissions" },
  { to: "/admin/messenger", icon: MessageSquare, label: "Messenger" },
  { to: "/admin/module-generator", icon: FileCode2, label: "Generator" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setLinkRef = useCallback((to: string, el: HTMLElement | null) => {
    if (el) {
      linkRefs.current.set(to, el);
    } else {
      linkRefs.current.delete(to);
    }
  }, []);

  const tooltipTarget = collapsed && hoveredItem ? linkRefs.current.get(hoveredItem) : null;
  const tooltipRect = tooltipTarget?.getBoundingClientRect();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
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
        className="hidden md:flex flex-col border-r border-zinc-200 bg-white h-[calc(100vh-4rem)] sticky top-16 z-40"
      >
        <div className="flex flex-col flex-1 gap-1 p-2 overflow-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              ref={(el) => setLinkRef(item.to, el)}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
              title={collapsed ? item.label : undefined}
            >
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                <item.icon className="h-4 w-4" />
              </div>

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

      {tooltipRect && collapsed && hoveredItem && (
        createPortal(
          <div
            className="fixed px-2.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
            style={{
              left: tooltipRect.right + 8,
              top: tooltipRect.top + tooltipRect.height / 2,
              transform: "translateY(-50%)",
            }}
          >
            {navItems.find((n) => n.to === hoveredItem)?.label}
          </div>,
          document.body
        )
      )}
    </>
  );
}
