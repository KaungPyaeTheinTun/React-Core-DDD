import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import DataTable from "../../components/ui/DataTable";
import EditForm from "../../components/users/EditForm";
import { useUsers } from "../../hooks/useUsers";
import { userApi } from "../../api/userApi";

function AssignRoleButton({ row, navigate }: { row: any; navigate: any }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex w-full items-center justify-end gap-1 relative">
      <button
        onClick={() =>
          navigate(`/admin/users/${row.id}/roles`, {
            state: {
              userName: row.fullName,
              userEmail: row.email,
            },
          })
        }
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="rounded-lg p-2 text-indigo-500 transition hover:bg-indigo-50 hover:text-indigo-700"
      >
        <KeyRound className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white"
          >
            Assign Roles
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2 } },
};

export default function UsersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, showForm, formData, setFormData, submitLoading, formattedRows, items, handleSubmit, resetForm } =
    useUsers();
  const [roleNamesByUserId, setRoleNamesByUserId] = useState<Record<string, string>>({});
  const rolesFetched = useRef(false);

  useEffect(() => {
    rolesFetched.current = false;
  }, [items]);

  const columns = ["Name", "Email", "Roles", "Status"];

  useEffect(() => {
    const updatedUserRoles = location.state?.updatedUserRoles;
    if (!updatedUserRoles?.userId) return;

    setRoleNamesByUserId((current) => ({
      ...current,
      [updatedUserRoles.userId]: updatedUserRoles.roleNames?.join(", ") || "-",
    }));

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (loading || formattedRows.length === 0 || rolesFetched.current) return;
    rolesFetched.current = true;

    let cancelled = false;

    async function loadUserRoles() {
      const entries = await Promise.all(
        formattedRows.map(async (user) => {
          try {
            const response = await userApi.getRoles(user.id);
            const roles = response?.data || [];
            const assignedRoleNames = roles
              .filter((role: any) => role.isAssigned ?? role.IsAssigned)
              .map((role: any) => role.roleName ?? role.RoleName)
              .filter(Boolean);

            return [user.id, assignedRoleNames.join(", ") || "-"];
          } catch {
            return [user.id, user.roles || "-"];
          }
        }),
      );

      if (!cancelled) {
        setRoleNamesByUserId((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    loadUserRoles();

    return () => {
      cancelled = true;
    };
  }, [formattedRows, loading]);

  const rows = useMemo(
    () =>
      formattedRows.map((row: any) => ({
        ...row,
        roles: roleNamesByUserId[row.id] || row.roles || "-",
      })),
    [formattedRows, roleNamesByUserId],
  );

  const renderTableActions = useCallback(
    (row: any) => <AssignRoleButton row={row} navigate={navigate} />,
    [navigate],
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <AnimatePresence mode="popLayout">
        {showForm && (
          <EditForm
            userForm={formData as unknown as Record<string, unknown>}
            setUserForm={setFormData as unknown as (value: Record<string, unknown>) => void}
            handleEditSubmit={handleSubmit}
            resetForm={resetForm}
            cardVariants={cardVariants}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Users Management">
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Synchronizing user data...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider">
              User data unavailable.
            </div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No users registered yet.
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              renderActions={renderTableActions}
            />
          )}
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
