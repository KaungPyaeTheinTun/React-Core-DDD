import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Package,
  Shield,
  KeyRound,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Fingerprint,
  Database,
  MessageSquare,
  ShoppingCart,
  type LucideProps,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ComponentType<LucideProps>;
  label: string;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<LucideProps>;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const navEntries: NavEntry[] = [
  { to: "/admin/categories", icon: Package, label: "Categories" },
  { to: "/admin/products", icon: ShoppingCart, label: "Products" },
  { to: "/admin/common-tables", icon: Database, label: "Common Table" },
  {
    label: "Roles & Permissions",
    icon: Shield,
    children: [
      { to: "/admin/users", icon: Users, label: "Users" },
      { to: "/admin/humans", icon: Fingerprint, label: "Humans" },
      { to: "/admin/roles", icon: Shield, label: "Roles" },
      { to: "/admin/permissions", icon: KeyRound, label: "Permissions" },
    ],
  },
  { to: "/admin/messenger", icon: MessageSquare, label: "Messenger" },
  { to: "/admin/module-generator", icon: FileCode2, label: "Generator" },
];

function findLabel(id: string): string | undefined {
  for (const entry of navEntries) {
    if (isGroup(entry)) {
      if (entry.label === id) return entry.label;
      const child = entry.children.find((c) => c.to === id);
      if (child) return child.label;
    } else if (entry.to === id) {
      return entry.label;
    }
  }
  return undefined;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const groups = navEntries.filter(isGroup);
    for (const group of groups) {
      if (group.children.some((child) => pathname.startsWith(child.to))) {
        return [group.label];
      }
    }
    return [];
  });
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map());

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label],
    );
  }, []);

  useEffect(() => {
    setOpenGroups((prev) =>
      prev.filter((label) => {
        const group = navEntries
          .filter(isGroup)
          .find((g) => g.label === label);
        return group
          ? group.children.some((child) => pathname.startsWith(child.to))
          : false;
      }),
    );
  }, [pathname]);

  const setLinkRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      linkRefs.current.set(id, el);
    } else {
      linkRefs.current.delete(id);
    }
  }, []);

  const tooltipTarget =
    collapsed && hoveredId ? linkRefs.current.get(hoveredId) : null;
  const tooltipRect = tooltipTarget?.getBoundingClientRect();
  const tooltipLabel = hoveredId ? findLabel(hoveredId) : null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
      isActive
        ? "bg-black text-white shadow-sm"
        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
    }`;

  const childLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-black text-white shadow-sm"
        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
    }`;

  const renderNavLink = (item: NavItem) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={linkClass}
      ref={(el) => setLinkRef(item.to, el)}
      onMouseEnter={() => setHoveredId(item.to)}
      onMouseLeave={() => setHoveredId(null)}
      title={collapsed ? item.label : undefined}
    >
      <div className="shrink-0 flex items-center justify-center w-5 h-5">
        <item.icon className="h-4 w-4" />
      </div>

      <motion.span
        animate={{
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : "auto",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-hidden whitespace-nowrap"
      >
        {item.label}
      </motion.span>
    </NavLink>
  );

  const renderGroup = (group: NavGroup) => {
    const isOpen = openGroups.includes(group.label);
    const groupActive = isOpen || group.children.some(
      (child) => pathname.startsWith(child.to),
    );

    return (
      <div key={group.label}>
        <button
          onClick={() => !collapsed && toggleGroup(group.label)}
          ref={(el) => setLinkRef(group.label, el)}
          onMouseEnter={() => setHoveredId(group.label)}
          onMouseLeave={() => setHoveredId(null)}
          title={collapsed ? group.label : undefined}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            groupActive
              ? "bg-black text-white shadow-sm"
              : "text-zinc-500 hover:text-black hover:bg-zinc-100"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 flex items-center justify-center w-5 h-5">
              <group.icon className="h-4 w-4" />
            </div>
            <motion.span
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden whitespace-nowrap"
            >
              {group.label}
            </motion.span>
          </div>

          {!collapsed && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          )}
        </button>

        {!collapsed && (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key={group.label}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="ml-3 border-l border-zinc-200 pl-3 py-1 space-y-0.5">
                  {group.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={childLinkClass}
                      ref={(el) => setLinkRef(child.to, el)}
                      onMouseEnter={() => setHoveredId(child.to)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="shrink-0 flex items-center justify-center w-4 h-4">
                        <child.icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {child.label}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col border-r border-zinc-200 bg-white h-[calc(100vh-4rem)] sticky top-16 z-40"
      >
        <div className="flex flex-col flex-1 gap-1 p-2 overflow-hidden">
          {navEntries.map((entry) =>
            isGroup(entry) ? renderGroup(entry) : renderNavLink(entry),
          )}
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

      {tooltipRect && collapsed && hoveredId && tooltipLabel &&
        createPortal(
          <div
            className="fixed px-2.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
            style={{
              left: tooltipRect.right + 8,
              top: tooltipRect.top + tooltipRect.height / 2,
              transform: "translateY(-50%)",
            }}
          >
            {tooltipLabel}
          </div>,
          document.body,
        )}
    </>
  );
}
