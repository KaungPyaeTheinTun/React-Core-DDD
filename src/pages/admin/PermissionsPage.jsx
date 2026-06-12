import { motion } from "framer-motion";
import SectionCard from "../../components/ui/SectionCard.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import { usePermissions } from "../../hooks/usePermissions.js";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const groupVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PermissionsPage() {
  const {
    loading,
    error,
    page,
    totalPages,
    totalModules,
    paginatedModuleNames,
    groupedPermissions,
    handlePageChange,
  } = usePermissions();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <SectionCard title="Permissions Management">
        {loading ? (
          <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
            Loading permissions...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-black text-xs font-medium uppercase tracking-wider border border-zinc-200 rounded-xl bg-zinc-50">
            {error}
          </div>
        ) : totalModules === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            No permissions defined yet.
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedModuleNames.map((module) => (
              <motion.div
                key={module}
                variants={groupVariants}
                initial="initial"
                animate="animate"
                className="border border-zinc-200 rounded-xl overflow-hidden"
              >
                <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    {module}
                    <span className="ml-2 text-zinc-400 font-medium">
                      ({groupedPermissions[module].length})
                    </span>
                  </h3>
                </div>
                <div className="px-5 py-3 flex flex-wrap gap-2">
                  {groupedPermissions[module].map((perm) => (
                    <span
                      key={perm.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-700 tracking-wide"
                    >
                      {perm.operation}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
