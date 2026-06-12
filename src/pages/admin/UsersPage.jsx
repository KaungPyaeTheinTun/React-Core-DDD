import { AnimatePresence, motion } from "framer-motion";
import SectionCard from "../../components/ui/SectionCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import EditForm from "../../components/users/EditForm.jsx";
import { useUsers } from "../../hooks/useUsers.js";

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

export default function UsersPage() {
  const { loading, error, showForm, formData, setFormData, submitLoading, formattedRows, handleSubmit, resetForm } =
    useUsers();

  const columns = ["Name", "Email", "Status"];

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
            userForm={formData}
            setUserForm={setFormData}
            handleEditSubmit={handleSubmit}
            resetForm={resetForm}
            cardVariants={cardVariants}
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
            <DataTable columns={columns} rows={formattedRows} />
          )}
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
