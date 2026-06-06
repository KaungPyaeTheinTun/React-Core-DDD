import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import SectionCard from "../components/SectionCard.jsx";
import DataTable from "../components/DataTable.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import EditForm from "../components/users/EditForm.jsx"; 
import { useUsers } from "../hooks/useUsers.js";
import { Trash2, Edit3 } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 },},
};

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },},
  exit: { opacity: 0,y: -12, scale: 0.99, transition: { duration: 0.2 },},
};

export default function UsersPage() {
  const {
    loading,
    error,
    showForm,
    userForm,
    setUserForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetUser,
    formattedRows,
    handleEditSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
  } = useUsers();

  const columns = ["Name", "Email"];

  const renderTableActions = useCallback(
    (row) => (
      <div className="flex w-full items-center justify-end gap-1">
        <button
          onClick={() => handleEditClick(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Edit User Profile"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => openDeleteConfirmation(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
    [handleEditClick, openDeleteConfirmation],
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
            cardVariants={cardVariants}
            userForm={userForm}
            setUserForm={setUserForm}
            handleEditSubmit={handleEditSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Users Management">
          {loading ? (
            <div className="py-10 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Fetching active records...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-black text-xs font-medium uppercase tracking-wider border border-zinc-200 rounded-xl bg-zinc-50">
              {error}
            </div>
          ) : formattedRows.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-sm">
              No active users registered.
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
            itemName={targetUser?.fullName || targetUser?.name || ""}
            title="Remove User Account"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
