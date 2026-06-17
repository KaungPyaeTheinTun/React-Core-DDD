import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import { userApi } from "../../api/userApi";
import { showNewCommentToast } from "../../utils/toast";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const normalizeId = (id: unknown) => (id ? String(id).toLowerCase() : "");

function getPayload(response: any) {
  return response?.data?.data ?? response?.data ?? response;
}

function normalizeRole(role: any) {
  return {
    id: role.roleId ?? role.RoleId ?? role.id ?? role.Id,
    name: role.roleName ?? role.RoleName ?? role.name ?? role.Name ?? "Role",
    isAssigned: Boolean(role.isAssigned ?? role.IsAssigned),
  };
}

export default function UserRolesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || "User";
  const userEmail = location.state?.userEmail || "";

  const [roles, setRoles] = useState<{ id: string; name: string; isAssigned: boolean }[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRoles() {
      try {
        setLoading(true);
        setError("");

        const response = await userApi.getRoles(id!);
        if (cancelled) return;

        const payload = getPayload(response);
        const nextRoles = (Array.isArray(payload) ? payload : []).map(
          normalizeRole,
        );

        setRoles(nextRoles);
        setAssignedIds(
          new Set(
            nextRoles
              .filter((role) => role.isAssigned)
              .map((role) => normalizeId(role.id)),
          ),
        );
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            (err as any)?.response?.data?.message ||
              (err as any)?.response?.data?.title ||
              "Failed to load user roles.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRoles();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const sortedRoles = useMemo(
    () => [...roles].sort((a, b) => a.name.localeCompare(b.name)),
    [roles],
  );

  const toggleRole = useCallback((roleId: string) => {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      const normalizedId = normalizeId(roleId);

      if (next.has(normalizedId)) next.delete(normalizedId);
      else next.add(normalizedId);

      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await userApi.saveRoles(id!, Array.from(assignedIds));
      const assignedRoleNames = roles
        .filter((role) => assignedIds.has(normalizeId(role.id)))
        .map((role) => role.name);

      showNewCommentToast("System", "Roles updated successfully.");
      navigate("/admin/users", {
        replace: true,
        state: {
          updatedUserRoles: {
            userId: id,
            roleNames: assignedRoleNames,
            savedAt: Date.now(),
          },
        },
      });
    } catch (err: unknown) {
      showNewCommentToast(
        "System",
        (err as any)?.response?.data?.message || "Failed to save roles.",
      );
    } finally {
      setSaving(false);
    }
  }, [assignedIds, id, navigate, roles]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-2xl space-y-6 bg-white p-4 text-black md:p-6"
    >
      <SectionCard
        title={userName + " — Roles"}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/users")}
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
                  Save Roles
                </>
              )}
            </button>
          </div>
        }
      >
          {loading ? (
            <div className="flex items-center justify-center py-16 text-zinc-400">
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading roles...
              </span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 py-12 text-center text-xs font-bold uppercase tracking-wider text-red-600">
              {error}
            </div>
          ) : sortedRoles.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-400">
              No roles available.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
              {sortedRoles.map((role) => (
                <label
                  key={role.id}
                  className="group flex cursor-pointer items-center gap-3 px-5 py-3"
                >
                  <input
                    type="checkbox"
                    checked={assignedIds.has(normalizeId(role.id))}
                    onChange={() => toggleRole(role.id)}
                    className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-zinc-700 transition-colors group-hover:text-zinc-900">
                    {role.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </SectionCard>
    </motion.div>
  );
}
