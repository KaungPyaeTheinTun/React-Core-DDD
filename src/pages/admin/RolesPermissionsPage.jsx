import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader, ChevronDown, ChevronsUpDown } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard.jsx";
import { permissionApi } from "../../api/permissionApi";
import { roleApi } from "../../api/roleApi";
import { showNewCommentToast } from "../../utils/toast.jsx";

const ADMIN_ROLE_ID = "22361810-1c3d-4d3d-8e40-a5df854034ea";

const normalizeId = (id) => (id ? String(id).toLowerCase() : "");

const readPermissionId = (item) => item?.id ?? item?.Id;

const readPermissionName = (item) => item?.name ?? item?.Name ?? "";

const readId = (item) => {
  if (!item || typeof item !== "object") return item;

  return (
    item.permissionId ??
    item.PermissionId ??
    item.id ??
    item.Id ??
    item.permission?.id ??
    item.permission?.Id ??
    item.Permission?.id ??
    item.Permission?.Id
  );
};

const extractPermissionIds = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return payload.map(readId).map(normalizeId).filter(Boolean);
  }

  const candidates = [
    payload?.permissionIds,
    payload?.PermissionIds,
    payload?.permissions,
    payload?.Permissions,
    payload?.rolePermissions,
    payload?.RolePermissions,
    payload?.items,
    payload?.Items,
    payload?.data?.permissionIds,
    payload?.data?.PermissionIds,
    payload?.data?.permissions,
    payload?.data?.Permissions,
    payload?.data?.rolePermissions,
    payload?.data?.RolePermissions,
    payload?.data?.items,
    payload?.data?.Items,
  ];

  const values = candidates.find(Array.isArray) || [];

  return values.map(readId).map(normalizeId).filter(Boolean);
};

const isAdminRole = (roleId, name) =>
  normalizeId(roleId) === ADMIN_ROLE_ID || name?.toLowerCase() === "admin";

export default function RolesPermissionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const roleName = location.state?.roleName || "Role";

  const [allPermissions, setAllPermissions] = useState([]);
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const permRes = await permissionApi.getAll();
        if (cancelled) return;
        setAllPermissions(permRes.data?.items || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load permissions");
          setLoading(false);
          return;
        }
      }

      try {
        const rolePermRes = await roleApi.getPermissions(id);
        if (cancelled) return;
        const permissionIds = extractPermissionIds(rolePermRes);
        setAssignedIds(
          new Set(
            permissionIds.length === 0 && isAdminRole(id, roleName)
              ? (permRes.data?.items || []).map(readPermissionId).map(normalizeId)
              : permissionIds,
          ),
        );
      } catch {
        try {
          const roleRes = await roleApi.get(id);
          if (cancelled) return;
          const permissionIds = extractPermissionIds(roleRes);
          setAssignedIds(
            new Set(
              permissionIds.length === 0 && isAdminRole(id, roleName)
                ? (permRes.data?.items || []).map(readPermissionId).map(normalizeId)
                : permissionIds,
            ),
          );
        } catch {
          if (!cancelled) {
            setAssignedIds(
              new Set(
                isAdminRole(id, roleName)
                  ? (permRes.data?.items || []).map(readPermissionId).map(normalizeId)
                  : [],
              ),
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const groupedPermissions = useMemo(() => {
    const groups = {};
    allPermissions.forEach((perm) => {
      const name = readPermissionName(perm);
      const dotIndex = name.indexOf(".");
      const module = dotIndex > -1 ? name.slice(0, dotIndex) : "Other";
      if (!groups[module]) groups[module] = [];
      groups[module].push(perm);
    });
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) =>
        readPermissionName(a).localeCompare(readPermissionName(b)),
      );
    }
    return groups;
  }, [allPermissions]);

  const moduleNames = useMemo(
    () => Object.keys(groupedPermissions).sort(),
    [groupedPermissions],
  );

  useEffect(() => {
    setExpandedModules((prev) => {
      const next = { ...prev };
      moduleNames.forEach((m) => {
        if (!(m in next)) next[m] = true;
      });
      return next;
    });
  }, [moduleNames]);

  const toggleModuleCollapse = useCallback((module) => {
    setExpandedModules((prev) => ({ ...prev, [module]: !prev[module] }));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedModules((prev) =>
      Object.fromEntries(Object.keys(prev).map((m) => [m, false])),
    );
  }, []);

  const expandAll = useCallback(() => {
    setExpandedModules((prev) =>
      Object.fromEntries(Object.keys(prev).map((m) => [m, true])),
    );
  }, []);

  const togglePermission = useCallback((permId) => {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      const id = normalizeId(permId);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleModule = useCallback(
    (moduleName, selectAll) => {
      const perms = groupedPermissions[moduleName];
      setAssignedIds((prev) => {
        const next = new Set(prev);
        perms.forEach((perm) => {
          const id = normalizeId(readPermissionId(perm));
          if (selectAll) next.add(id);
          else next.delete(id);
        });
        return next;
      });
    },
    [groupedPermissions],
  );

  const moduleSelectedCount = useCallback(
    (moduleName) => {
      const perms = groupedPermissions[moduleName];
      if (!perms) return 0;
      return perms.filter((p) =>
        assignedIds.has(normalizeId(readPermissionId(p))),
      ).length;
    },
    [groupedPermissions, assignedIds],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await roleApi.savePermissions(id, Array.from(assignedIds));
      showNewCommentToast("System", "Permissions updated successfully.");
      navigate("/admin/roles", { replace: true });
    } catch (err) {
      showNewCommentToast("System", err.response?.data?.message || "Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  }, [id, assignedIds, navigate]);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 bg-white text-black">
      <SectionCard
        title={roleName + " — Permissions"}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/roles")}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-700 uppercase tracking-wider hover:bg-zinc-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-xs font-bold text-white uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-40 transition"
            >
              {saving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Loading permissions...
            </span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        ) : moduleNames.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            No permissions available.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={collapseAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
                Collapse All
              </button>
              <button
                onClick={expandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all"
              >
                <ChevronsUpDown className="h-3.5 w-3.5 rotate-180" />
                Expand All
              </button>
            </div>
            {moduleNames.map((module) => {
              const perms = groupedPermissions[module];
              const checked = moduleSelectedCount(module);
              const allSelected = checked === perms.length;
              const someSelected = checked > 0 && !allSelected;
              const isExpanded = expandedModules[module] ?? true;

              return (
                <div
                  key={module}
                  className="border border-zinc-200 rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() => toggleModuleCollapse(module)}
                    className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-200 cursor-pointer select-none"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </motion.span>
                      {module} Operations ({checked}/{perms.length})
                    </h3>
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={() => toggleModule(module, !allSelected)}
                        className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      Select All
                    </label>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 divide-y divide-zinc-100">
                          {perms.map((perm) => {
                            const permissionName = readPermissionName(perm);
                            const permissionId = readPermissionId(perm);
                            const dotIndex = permissionName.indexOf(".");
                            const actionName =
                              dotIndex > -1
                                ? permissionName.slice(dotIndex + 1)
                                : permissionName;

                            return (
                              <label
                                key={permissionId}
                                className="flex items-center gap-3 py-2.5 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={assignedIds.has(normalizeId(permissionId))}
                                  onChange={() => togglePermission(permissionId)}
                                  className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                                  {actionName}
                                </span>
                                <span className="text-xs text-zinc-400 ml-auto font-mono">
                                  {permissionName}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
