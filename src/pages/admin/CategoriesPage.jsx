import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import SectionCard from "../../components/ui/SectionCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import DeleteModal from "../../components/ui/DeleteModal.jsx";
import CreateForm from "../../components/categories/CreateForm.jsx";
import EditForm from "../../components/categories/EditForm.jsx";
import { useCategories } from "../../hooks/useCategories.js";
import { Image, PackagePlus, Trash2, Edit3, X } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2 } },
};

export default function CategoriesPage() {
  const {
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    categoryForm,
    setCategoryForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetCategory,
    formattedRows,
    handleFormSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
    imageFiles,
    setImageFiles,
  } = useCategories();

  const columns = ["Image", "Product Name", "Price", "Description"];

  const renderCell = useCallback((value, index) => {
    if (index === 0) {
      const urls = value || [];
      return urls.length > 0 ? (
        <div className="flex -space-x-1.5">
          {urls.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-8 w-8 rounded-lg border-2 border-white object-cover"
            />
          ))}
          {urls.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white bg-zinc-100 text-[10px] font-bold text-zinc-500">
              +{urls.length - 3}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-300">
          <Image className="h-4 w-4" />
        </div>
      );
    }
    return value;
  }, []);

  const renderTableActions = useCallback(
    (row) => (
      <div className="flex w-full items-center justify-end gap-1">
        <button
          onClick={() => handleEditClick(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Edit Item"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => openDeleteConfirmation(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Delete Item"
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
        <PackagePlus className="h-3.5 w-3.5" />
      )}
      {showForm || editingId ? "Cancel" : "Add Category"}
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
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
          />
        )}

        {editingId && (
          <EditForm
            cardVariants={cardVariants}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Categories" action={headerAction}>
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Synchronizing live category data...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Category management coming soon.
            </div>
          ) : formattedRows.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              Inventory pipeline is empty.
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={formattedRows}
              renderActions={renderTableActions}
              renderCell={renderCell}
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
            itemName={targetCategory?.name || ""}
            title="Remove Product From Inventory"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
