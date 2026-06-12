import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SectionCard from "../../components/ui/SectionCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import DeleteModal from "../../components/ui/DeleteModal.jsx";
import CreateForm from "../../components/roles/CreateForm.jsx";
import EditForm from "../../components/roles/EditForm.jsx";
import { useRoles } from "../../hooks/useRoles.js";
import { ShieldPlus, Trash2, Edit3, KeyRound, X } from "lucide-react";

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
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2 } },
};

export default function RolesPage() {
  const navigate = useNavigate();

  const {
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    roleForm,
    setRoleForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetItem,
    formattedRows,
    handleFormSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
  } = useRoles();

  const columns = ["Role Name"];

  const renderTableActions = useCallback(
    (row) => (
      <div className="flex w-full items-center justify-end gap-1">
        <button
          onClick={() => navigate(`/admin/roles/${row.id}/permissions`, { state: { roleName: row.name } })}
          className="rounded-lg p-2 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition"
          title="Manage Permissions"
        >
          <KeyRound className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleEditClick(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Edit Role"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => openDeleteConfirmation(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Delete Role"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
    [navigate, handleEditClick, openDeleteConfirmation],
  );

  const headerAction = (
    <button
      onClick={() => (showForm || editingId ? resetForm() : setShowForm(true))}
      className="flex items-center gap-1.5 rounded-xl bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition"
    >
      {showForm || editingId ? (
        <X className="h-3.5 w-3.5" />
      ) : (
        <ShieldPlus className="h-3.5 w-3.5" />
      )}
      {showForm || editingId ? "Cancel" : "Add Role"}
    </button>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <AnimatePresence mode="popLayout">
        {showForm && !editingId && (
          <CreateForm
            cardVariants={cardVariants}
            roleForm={roleForm}
            setRoleForm={setRoleForm}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
          />
        )}

        {editingId && (
          <EditForm
            cardVariants={cardVariants}
            roleForm={roleForm}
            setRoleForm={setRoleForm}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Roles Management" action={headerAction}>
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Loading roles...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-black text-xs font-medium uppercase tracking-wider border border-zinc-200 rounded-xl bg-zinc-50">
              {error}
            </div>
          ) : formattedRows.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No roles defined yet.
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={formattedRows}
              renderActions={renderTableActions}
            />
          )}
        </SectionCard>
      </motion.div>

      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={targetItem?.name || ""}
            title="Remove Role"
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
