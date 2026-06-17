import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import { UserPlus, Edit3, Trash2, X } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import DataTable from "../../components/ui/DataTable";
import DeleteModal from "../../components/ui/DeleteModal";
import CreateForm from "../../components/humans/CreateForm";
import EditForm from "../../components/humans/EditForm";
import { useHumans } from "../../hooks/useHumans";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2 } },
};

export default function HumansPage() {
  const {
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    humanForm,
    setHumanForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetHuman,
    formattedRows,
    handleFormSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
  } = useHumans();

  const columns = ["System Code", "Name", "Age", "Email", "Gender"];

  const renderTableActions = useCallback(
    (row: any) => (
      <div className="flex w-full items-center justify-end gap-1">
        <button
          onClick={() => handleEditClick(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Edit Human"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => openDeleteConfirmation(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Delete Human"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
    [handleEditClick, openDeleteConfirmation],
  );

  const headerAction = (
    <button
      onClick={() => (showForm || editingId ? resetForm() : setShowForm(true))}
      className="flex items-center gap-1.5 rounded-xl bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition"
    >
      {showForm || editingId ? (
        <X className="h-3.5 w-3.5" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      {showForm || editingId ? "Cancel" : "Add Human"}
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
            humanForm={humanForm as unknown as Record<string, unknown>}
            setHumanForm={setHumanForm as unknown as (value: Record<string, unknown>) => void}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
          />
        )}

        {editingId && (
          <EditForm
            cardVariants={cardVariants}
            humanForm={humanForm as unknown as Record<string, unknown>}
            setHumanForm={setHumanForm as unknown as (value: Record<string, unknown>) => void}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Humans" action={headerAction}>
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Synchronizing human data...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Human data unavailable.
            </div>
          ) : formattedRows.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No humans registered yet.
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
            itemName={(targetHuman?.name as string) || ""}
            title="Remove Human Record"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
